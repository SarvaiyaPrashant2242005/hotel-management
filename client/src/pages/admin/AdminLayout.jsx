import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Building2, BedSingle, CreditCard } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/hotels", label: "Hotels", icon: Building2 },
  { to: "/admin/rooms", label: "Rooms", icon: BedSingle },
  { to: "/admin/bookings", label: "Bookings", icon: LayoutDashboard },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <Link to="/admin" className="font-semibold tracking-tight">
              Hotel Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/admin" className="hover:underline">
                Back to site
              </Link>
              <Button
                variant="ghost"
                className="text-teal-400 hover:text-teal-300 border border-teal-400 hover:border-teal-300"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
          <aside className="md:sticky md:top-4 h-max">
            <div className="rounded-lg border bg-card p-2">
              {navItems.map((n) => {
                const Icon = n.icon;
                return (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      )
                    }
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{n.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </aside>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}