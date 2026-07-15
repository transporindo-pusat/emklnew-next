'use client';

export async function deleteCookie() {
  if (typeof document === 'undefined') return;

  // NextAuth uses different cookie names depending on env:
  // - dev/HTTP:  next-auth.session-token, next-auth.csrf-token
  // - prod/HTTPS: __Secure-next-auth.session-token, __Host-next-auth.csrf-token
  const names = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Host-next-auth.csrf-token',
    'next-auth.callback-url'
  ];

  const hostname = window.location.hostname;

  names.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${hostname}`;
  });
}
