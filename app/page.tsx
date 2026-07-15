import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/options';

const Page = async () => {
  const session = await getServerSession(authOptions);
  // session.error (mis. refresh token 401) = sesi mati → perlakukan seperti
  // belum login: langsung ke signin, jangan pantulkan ke /dashboard dulu.
  if (!session || session.error) {
    return redirect('/auth/signin');
  } else {
    return redirect('/dashboard');
  }
};

export default Page;
