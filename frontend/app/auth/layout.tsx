import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="absolute top-0 right-0 p-4">
        <ThemeToggle />
      </div>

      {children}
    </div>
  );
}
