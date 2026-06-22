import { PortalShell } from "@/components/portal-shell";
import { RoleProvider } from "@/components/role-context";
import { TaskProvider } from "@/components/task-context";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <RoleProvider><TaskProvider><PortalShell>{children}</PortalShell></TaskProvider></RoleProvider>;
}
