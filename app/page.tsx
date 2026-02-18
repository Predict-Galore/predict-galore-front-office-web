// app/page.tsx
import { redirect } from 'next/navigation';

// Avoid static prerender so redirect runs without triggering client context during SSG
export const dynamic = 'force-dynamic';

export default function RootPage() {
  redirect('/landing-page');
}
