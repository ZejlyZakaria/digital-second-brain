import { redirect } from 'next/navigation';

export default function WatchingPage() {
  redirect('/perso/watching/movies'); // Redirige auto vers movies par défaut
  return null; // Ou un loader si besoin
}