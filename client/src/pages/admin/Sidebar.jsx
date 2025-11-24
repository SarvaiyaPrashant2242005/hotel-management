import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2, BedSingle, CreditCard, CalendarCheck2, Users } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/hotels", label: "Hotels", icon: Building2 },
  { to: "/admin/rooms", label: "Rooms", icon: BedSingle },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function Sidebar() {
  return (
    <aside className="md:sticky md:top-4 h-max">
      <nav className="rounded-lg border bg-card p-2">
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
      </nav>
    </aside>
  );
}
