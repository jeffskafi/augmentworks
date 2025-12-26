export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through for admin routes - they have their own layout
  return <>{children}</>;
}

