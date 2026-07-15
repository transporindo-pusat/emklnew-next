import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/'
    };
  },
  useSearchParams() {
    return {
      get: jest.fn()
    };
  },
  usePathname() {
    return '/';
  }
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// jsdom doesn't implement these DOM APIs that Radix UI (Select, etc.) calls.
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (jest.fn() as any);
  (Element.prototype as any).hasPointerCapture =
    (Element.prototype as any).hasPointerCapture || (jest.fn() as any);
  (Element.prototype as any).setPointerCapture =
    (Element.prototype as any).setPointerCapture || (jest.fn() as any);
  (Element.prototype as any).releasePointerCapture =
    (Element.prototype as any).releasePointerCapture || (jest.fn() as any);
}

// react-dom@19 removed findDOMNode, but some legacy widgets still call it.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const reactDom = require('react-dom');
  if (typeof reactDom.findDOMNode !== 'function') {
    reactDom.findDOMNode = (instance: any) => instance ?? null;
  }
} catch {
  // ignore
}

// Polyfill fetch for jsdom. The Axios instance / next-auth getSession touch
// fetch during module init; without this they throw "fetch is not defined".
if (typeof (global as any).fetch === 'undefined') {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '{}'
    })
  ) as any;
}
