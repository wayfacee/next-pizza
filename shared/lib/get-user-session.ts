import { getServerSession } from 'next-auth';
import { authOptions } from '../contstants';

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);
  // return token & user

  return session?.user ?? null; // token not need
}; 

// НЕЛЬЗЯ РЕЭКСПОРТИРОВАТЬ В ИНДЕКС.ТС 
// потому что там есть функции, которые юзаются на клиенте