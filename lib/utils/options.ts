import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';
import { tokenCache } from './AxiosInstance';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL2}/auth/refresh-token`,
      { refreshToken: token.refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const refreshedTokens = response.data;

    const newToken = {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      accessTokenExpires: refreshedTokens.accessTokenExpires,
      users: refreshedTokens.users ?? token.users,
      cabang_id: refreshedTokens.cabang_id ?? token.cabang_id,
      error: undefined
    };

    // ✅ Update cache setelah refresh berhasil
    if (typeof window !== 'undefined') {
      tokenCache.updateCache({
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
        expiresAt: refreshedTokens.accessTokenExpires
          ? new Date(refreshedTokens.accessTokenExpires).getTime()
          : 0
      });
    }

    return newToken;
  } catch (error) {
    // 401 dari /auth/refresh-token = refresh token invalid/expired (mis. backend
    // :5004 baru restart / DB tokennya di-reset). Ini kondisi auth-expiry yang
    // WAJAR & sudah ditangani: kita set token.error → session.error →
    // proxy.ts/AxiosInstance memaksa re-login. Pakai console.warn (bukan
    // console.error) agar tidak memicu overlay merah "Console Error" Next.js dev
    // untuk kondisi yang sudah tertangani — pola yang sama dipakai di
    // AxiosInstance. Error selain 401 (backend down / 500) tetap console.error
    // karena itu tak terduga.
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401) {
      console.warn('⚠️ Refresh token invalid/expired — memaksa re-login');
    } else {
      console.error('❌ Error refreshing access token:', error);
    }

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.username !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          throw new Error('No credentials provided');
        }

        try {
          const formData = new URLSearchParams();
          formData.append('username', credentials.username);
          formData.append('password', credentials.password);

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL2}/auth/login`,
            formData,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );

          if (response.data) {
            return {
              id: response.data.users.id,
              users: response.data.users,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              cabang_id: response.data.cabang_id,
              cabang: response.data.cabang,
              pelabuhan: response.data.pelabuhan,
              accessTokenExpires: response.data.accessTokenExpires
            };
          } else {
            throw new Error('Invalid username or password');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            console.error('❌ API Error Response:', error.response.data);
            throw new Error(
              error.response.data.message || 'Invalid username or password'
            );
          } else {
            console.error('❌ Login Error:', error);
            throw new Error('An error occurred while logging in');
          }
        }
      }
    })
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // ✅ 1. Initial sign in
      if (user) {
        const newToken = {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          users: user.users,
          cabang_id: user.cabang_id,
          cabang: user.cabang,
          pelabuhan: user.pelabuhan,
          error: undefined
        };

        if (typeof window !== 'undefined') {
          tokenCache.updateCache({
            accessToken: user.accessToken as string,
            refreshToken: user.refreshToken as string,
            expiresAt: user.accessTokenExpires
              ? new Date(user.accessTokenExpires).getTime()
              : 0
          });
        }

        return newToken;
      }

      // ✅ 2. Token sudah error dari siklus sebelumnya. JANGAN return null:
      // mengembalikan null dari callback jwt/session membuat /api/auth/session
      // membalas HTML error page → next-auth CLIENT_FETCH_ERROR
      // "Unexpected token '<', <!DOCTYPE". Kembalikan token apa adanya (membawa
      // error) agar session callback meneruskannya sebagai session.error —
      // yang sudah ditangani proxy.ts & AxiosInstance untuk memaksa logout.
      if (token.error) {
        return token;
      }

      // ✅ 3. Check token expiry
      const expiresAt = token.accessTokenExpires
        ? new Date(token.accessTokenExpires as string).getTime()
        : 0;

      const bufferTime = 2 * 60 * 1000;
      const shouldRefresh = Date.now() > expiresAt - bufferTime;

      // ✅ 4. Token masih valid, update cache
      if (!shouldRefresh) {
        if (typeof window !== 'undefined') {
          tokenCache.updateCache({
            accessToken: token.accessToken as string,
            refreshToken: token.refreshToken as string,
            expiresAt: token.accessTokenExpires
              ? new Date(token.accessTokenExpires as string).getTime()
              : 0
          });
        }
        return token;
      }

      // ✅ 5. Refresh token. refreshAccessToken() mengembalikan token dengan
      // field `error` bila gagal — kembalikan apa adanya (JANGAN null). Logout
      // dipicu via session.error oleh proxy.ts/AxiosInstance, tanpa merusak
      // respons JSON dari /api/auth/session.
      const refreshedToken = await refreshAccessToken(token);

      return refreshedToken;
    },

    async session({ session, token }) {
      // JANGAN return null di sini — itu membuat /api/auth/session membalas HTML
      // sehingga next-auth melempar CLIENT_FETCH_ERROR "Unexpected token '<'".
      // Selalu kembalikan objek session dan teruskan error lewat session.error;
      // proxy.ts (redirect) & AxiosInstance (handleLogout) sudah memprosesnya.
      if (token) {
        session.userId = token.id as string;
        session.token = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.accessTokenExpires = token.accessTokenExpires as string;
        session.user = token.users as any;
        session.cabang_id = token.cabang_id as string;
        session.cabang = token.cabang as string;
        session.pelabuhan = token.pelabuhan as string;
        session.error = token.error as string | undefined;
      }

      return session;
    }
  },

  session: {
    strategy: 'jwt'
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',

  // ✅ TAMBAHAN: Event handler untuk logout otomatis
  events: {
    async signOut() {
      if (typeof window !== 'undefined') {
        tokenCache.clearCache();
      }
    }
  }
};
