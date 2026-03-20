import AppSidebar from "@/components/app-shell/AppSidebar";
import AppMobileNav from "@/components/app-shell/AppMobileNav";
import AppTopBar from "@/components/app-shell/AppTopBar";
import PrivyClientProvider from "@/components/providers/PrivyClientProvider";
import AppShellClient from "@/components/app-shell/AppShellClient";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivyClientProvider>
      <AppShellClient>
        {children}
      </AppShellClient>
    </PrivyClientProvider>
  );
}
