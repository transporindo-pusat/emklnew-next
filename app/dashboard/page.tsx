import React from 'react';
import OverViewPage from './overview/_components/overview';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils/options';

const Page = async () => {
  const session = await getServerSession(authOptions);

  // session.error diset saat refresh token gagal (mis. 401 refresh token
  // invalid). session tidak null tapi rusak — redirect ke signin, jangan render
  // dashboard dengan sesi mati (kalau tidak, komponen client-nya akan menembak
  // API dengan token kedaluwarsa dan semuanya 401).
  if (!session || session.error) {
    redirect('/auth/signin');
  }

  return <OverViewPage />;
};

export default Page;
