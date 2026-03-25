// app/auth/layout.tsx
// auth pages have no sidebar or navbar
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}