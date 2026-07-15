/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'mongodb',
    'pg',
    'mysql2',
    'oracledb',
    'tedious',
    // @resvg/resvg-js punya native binding (.node) yang ditarik
    // svg2img -> stimulsoft-reports-js ke layer "Client Component SSR".
    // Turbopack tak bisa menaruh asset .node di ESM chunk → `next build` gagal
    // ("non-ecmascript placeable asset"). Externalize agar di-require saat
    // runtime (Node bisa load .node) alih-alih di-bundle. Kode report lazy-load
    // via import() di useEffect (client-only) sehingga tak pernah dieksekusi di
    // server. Browser tetap memakai stub di turbopack.resolveAlias di bawah.
    'svg2img',
    '@resvg/resvg-js'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5004',
        pathname: '/uploads/**',
        search: ''
      },
      {
        protocol: 'https',
        hostname: 'hrapi.transporindo.com',
        pathname: '/uploads/**',
        search: ''
      }
    ]
  },
  transpilePackages: ['geist', 'react-data-grid'],
  typescript: {
    ignoreBuildErrors: true
  },
  // NONAKTIF SEMENTARA: cache FS Turbopack eksperimental ini memicu panic
  // "Failed to write app endpoint /dashboard/alat-bayar/page: Next.js package
  // not found" saat route berat di-recompile. Aktifkan lagi kalau sudah stabil.
  // experimental: {
  //   turbopackFileSystemCacheForDev: true
  // },
  // Turbopack (dipakai saat `next dev`/`next build`) mengabaikan blok webpack()
  // di bawah. stimulsoft-data-adapter adalah modul server-only yang menarik
  // driver DB (mongodb -> child_process) ke bundle browser. Aplikasi ini
  // me-render report dari JSON sehingga adapter itu tak pernah dipakai di
  // client, jadi kita alias ke stub kosong khusus kondisi browser.
  turbopack: {
    resolveAlias: {
      // --- Semua dependency node-only stimulsoft-reports-js ---
      // (lihat package.json stimulsoft). Di-render dari JSON & pakai API browser
      // (canvas/XHR) di client, jadi paket server-only ini tak terpakai.
      'stimulsoft-data-adapter': { browser: './stubs/empty.js' }, // -> mongodb/mysql2/oracledb/pg/tedious
      'node-machine-id': { browser: './stubs/empty.js' }, // -> child_process
      svg2img: { browser: './stubs/empty.js' }, // -> jimp -> @jimp/core -> fs/path
      'jimp-compact': { browser: './stubs/empty.js' }, // -> fs
      'sync-request': { browser: './stubs/empty.js' }, // -> http/net/fs/child_process
      // --- Catch-all built-in Node yang tak ada padanannya di browser ---
      // Setara webpack resolve.fallback { fs: false, child_process: false }.
      fs: { browser: './stubs/empty.js' },
      'node:fs': { browser: './stubs/empty.js' },
      child_process: { browser: './stubs/empty.js' },
      'node:child_process': { browser: './stubs/empty.js' }
    }
  },
  webpack(config) {
    config.externals = [...(config.externals || []), 'stimulsoft-reports-js'];
    return config;
  }
};

module.exports = nextConfig;
