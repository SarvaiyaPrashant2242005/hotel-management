import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/hotels", label: "Hotels" },
  { to: "/admin/rooms", label: "Rooms" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/payments", label: "Payments" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">Hotel Admin</Link>
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:underline">Back to site</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-6">
        <aside className="md:sticky md:top-4 h-max">
          <div className="rounded-lg border bg-card p-2">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end as any}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
