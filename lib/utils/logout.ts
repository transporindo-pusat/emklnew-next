import { signOut } from 'next-auth/react';
import { store, persistor } from '@/lib/store/store';
import { clearCredentials } from '@/lib/store/authSlice/authSlice';
import { clearPdfUrls } from '@/lib/store/pdfSlice/pdfSlice';
import { clearReport } from '@/lib/store/reportSlice/reportSlice';
import { clearSearch } from '@/lib/store/searchLookupSlice/searchLookupSlice';
import { tokenCache } from './AxiosInstance';
import { deleteCookie } from './cookie-actions';

/**
 * Single source of truth for logout. Clears:
 * - In-memory token cache (AxiosInstance)
 * - NextAuth session (cookie + server-side)
 * - All persisted Redux slices (auth, menu, search, report, pdfUrl)
 * - localStorage via persistor.purge()
 *
 * Caller is responsible for navigation after this resolves.
 */
export async function performLogout(): Promise<void> {
  // 1. Clear axios token cache first so no further authenticated requests fire
  tokenCache.clearCache();

  // 2. End the NextAuth session (clears httpOnly session cookie server-side)
  await signOut({ redirect: false });

  // 3. Remove any remaining NextAuth cookies from the browser
  await deleteCookie();

  // 4. Clear all persisted Redux slices so the next login gets a clean slate
  store.dispatch(clearCredentials());
  store.dispatch(clearPdfUrls());
  store.dispatch(clearReport());
  store.dispatch(clearSearch());

  // 5. Wipe localStorage (redux-persist storage)
  await persistor.purge();
}
