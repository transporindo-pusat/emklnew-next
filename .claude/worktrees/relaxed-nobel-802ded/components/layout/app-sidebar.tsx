'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { ChevronRight, GalleryVerticalEnd, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { Icons } from '../icons';
import { UserNav } from './user-nav';
import { Input } from '../ui/input';
import { IoSearch } from 'react-icons/io5';
import { setCollapse } from '@/lib/store/collapseSlice/collapseSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { persistor, RootState, store } from '@/lib/store/store';
import { api, api2, tokenCache } from '@/lib/utils/AxiosInstance';
import JsxParser from 'react-jsx-parser';
import { useGetSearchMenu } from '@/lib/server/useMenu';
import { FaTimes } from 'react-icons/fa';
import IcTasSmall from '@/public/image/IcTas-Small.png';
import Image from 'next/image';
import Header from './header';
import { signOut, useSession } from 'next-auth/react';
import { clearCredentials } from '@/lib/store/authSlice/authSlice';
import { deleteCookie } from '@/lib/utils/cookie-actions';
import { clearHeaderData } from '@/lib/store/headerSlice/headerSlice';
import { setLoaded, setLoading } from '@/lib/store/loadingSlice/loadingSlice';
import useDisableBodyScroll from '@/lib/hooks/useDisableBodyScroll';

export const company = {
  name: 'PT. TRANSPORINDO AGUNG SEJAHTERA',
  logo: GalleryVerticalEnd
};

interface AppSidebarProps {
  children: React.ReactNode;
  ip: string;
  initialDateTime: string;
}

// ─── Isolated JsxParser wrapper ────────────────────────────────────────────
// Memoized so it ONLY re-renders when menuData string actually changes.
// openMenus & hoveredItemId state live here so their changes never bubble
// up to re-render the whole sidebar.
const MenuRenderer = React.memo(
  ({ menuData }: { menuData: string }) => {
    const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>(
      {}
    );
    const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(
      null
    );

    // Cache hasil parse — hanya re-parse kalau string berubah
    const parsedRef = React.useRef<{
      data: string;
      element: React.ReactNode;
    } | null>(null);

    const handleToggle = React.useCallback((title: string) => {
      setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    }, []);

    const isMenuOpen = React.useCallback(
      (menuName: string) => openMenus[menuName] || false,
      [openMenus]
    );

    const bindings = React.useMemo(
      () => ({
        handleToggle,
        openMenus,
        setOpenMenus,
        isMenuOpen,
        setHoveredItemId,
        hoveredItemId
      }),
      [handleToggle, openMenus, isMenuOpen, hoveredItemId]
    );

    // Hanya buat JsxParser element baru kalau menuData berubah
    if (!parsedRef.current || parsedRef.current.data !== menuData) {
      parsedRef.current = {
        data: menuData,
        element: (
          <JsxParser
            allowUnknownElements={true}
            autoCloseVoidElements={false}
            blacklistedAttrs={[]}
            components={JSX_COMPONENTS}
            jsx={menuData}
          />
        )
      };
    }

    // Clone element dengan bindings terbaru tanpa re-parse
    return React.cloneElement(parsedRef.current.element as React.ReactElement, {
      bindings
    });
  },
  (prev, next) => prev.menuData === next.menuData
);
MenuRenderer.displayName = 'MenuRenderer';

// Defined outside component so the reference is always stable
const JSX_COMPONENTS = {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  Icons: (props: any) => <Icons {...props} />,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ChevronRight,
  Link: (props: any) => <Link {...props} />
};

// ─── Search results dropdown ────────────────────────────────────────────────
const SearchResults = React.memo(
  ({
    results,
    hasSearch,
    onClickItem
  }: {
    results: any[];
    hasSearch: boolean;
    onClickItem: () => void;
  }) => {
    if (!hasSearch) return null;

    return (
      <div className="absolute top-full z-50 h-fit max-h-[500px] w-full overflow-y-auto rounded bg-white shadow-md">
        {results.length > 0 ? (
          results.map((menu) => (
            <Link
              key={menu.id}
              onClick={onClickItem}
              href={`/dashboard/${menu.url.toLowerCase()}`}
              className="flex min-h-[30px] cursor-pointer flex-col border border-gray-400 bg-gray-700 px-2 py-1 hover:bg-gray-500"
            >
              <span className="text-sm">{menu.title}</span>
              <span className="text-[8px]">{menu.parentBreadcrumb}</span>
            </Link>
          ))
        ) : (
          <div className="flex cursor-pointer flex-col border border-gray-400 bg-gray-700 px-2 py-1 hover:bg-gray-500">
            No Element Found
          </div>
        )}
      </div>
    );
  }
);
SearchResults.displayName = 'SearchResults';

// ─── Dashboard link ─────────────────────────────────────────────────────────
const DashboardLink = React.memo(({ activePath }: { activePath: string }) => (
  <SidebarMenuSubItem>
    <SidebarMenuSubButton asChild isActive={activePath === '/dashboard'}>
      <Link prefetch={true} href="/dashboard" className="py-4">
        <Icons name="PERSONSETTINGS" className="icon-white text-white" />
        <span className="text-sm">DASHBOARD</span>
      </Link>
    </SidebarMenuSubButton>
  </SidebarMenuSubItem>
));
DashboardLink.displayName = 'DashboardLink';

// ─── Main component ─────────────────────────────────────────────────────────
export default function AppSidebar({
  children,
  ip,
  initialDateTime
}: AppSidebarProps) {
  const { setOpen } = useSidebar();
  const [mounted, setMounted] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [currentDateTime, setCurrentDateTime] = React.useState(initialDateTime);
  const [searchQuery, setSearchQuery] = React.useState(''); // debounced value
  const searchDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { data: session } = useSession();

  const menuData = useSelector((state: RootState) => state.menu.menuData);
  const dispatch = useDispatch();
  const deferredMenuData = React.useDeferredValue(menuData);
  const isStale = menuData !== deferredMenuData;
  const [activePath, setActivePath] = React.useState<string>('');
  const pathname = usePathname();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const logout = React.useCallback(async () => {
    tokenCache.clearCache();
    dispatch(clearCredentials());
    await persistor.purge();
    await signOut({ callbackUrl: '/auth/signin' });
  }, [dispatch]);

  // ── Path tracking ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (activePath !== pathname) {
      dispatch(clearHeaderData());
    }
  }, [pathname, activePath, dispatch]);

  // ── Search ────────────────────────────────────────────────────────────────
  const userId = session?.user.id ?? '';

  const { data: allMenu } = useGetSearchMenu({ search: searchQuery, userId });
  const searchResults = React.useMemo(
    () => (searchQuery ? allMenu ?? [] : []),
    [searchQuery, allMenu]
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearch(query);

      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        setSearchQuery(query);
      }, 300);
    },
    []
  );

  const handleClearSearch = React.useCallback(() => {
    setSearch('');
    setSearchQuery('');
  }, []);

  const handleClickSearch = React.useCallback(() => {
    setSearch('');
    setSearchQuery('');
    setOpen(false);
  }, [setOpen]);

  // ── Clock ─────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setCurrentDateTime(
        `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(
          d.getHours()
        )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Sidebar collapsible="offcanvas" variant="floating">
        <SidebarHeader>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
            <div className="text-sidebar-black flex aspect-square size-10 items-center justify-center rounded-lg bg-white">
              <Image src={IcTasSmall} alt="logo tas" />
            </div>
            <div className="grid flex-1 text-left text-xs leading-tight">
              <span className="break-words font-semibold text-white">
                {company.name}
              </span>
            </div>
          </div>

          {/* Search box */}
          <div className="relative flex items-center">
            <Input
              value={search}
              onChange={handleSearchChange}
              className="h-8 rounded-sm border bg-transparent text-white placeholder:text-white focus:bg-transparent"
              placeholder="Search.."
            />
            {searchQuery ? (
              <FaTimes
                className="absolute right-2 cursor-pointer"
                onClick={handleClearSearch}
              />
            ) : (
              <IoSearch className="absolute right-2" />
            )}
            <SearchResults
              results={searchResults}
              hasSearch={!!searchQuery}
              onClickItem={handleClickSearch}
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="scroll overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel className="mt-2">MENU</SidebarGroupLabel>
            <SidebarMenu>
              <DashboardLink activePath={activePath} />

              {/* JsxParser isolated — state changes inside never re-render sidebar */}
              {deferredMenuData && (
                <div
                  style={{
                    opacity: isStale ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <MenuRenderer menuData={deferredMenuData} />
                </div>
              )}

              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  asChild
                  onClick={logout}
                  className="cursor-pointer"
                >
                  <div>
                    <Icons name="LOGOUT" className="icon-white text-white" />
                    <span className="text-sm">LOGOUT</span>
                  </div>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-8">
          <div>
            <p className="text-center">
              VERSION {process.env.NEXT_PUBLIC_VERSION}
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header ip={ip} currentDateTime={currentDateTime} />
        {children}
      </SidebarInset>
    </>
  );
}
