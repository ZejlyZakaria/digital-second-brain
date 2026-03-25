import { redirect } from 'next/navigation';

export default function SportRedirect() {
  redirect('/perso/sports/football');
  return null;
}