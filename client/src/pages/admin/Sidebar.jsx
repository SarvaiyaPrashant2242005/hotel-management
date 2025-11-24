import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Building2, BedSingle, CreditCard, CalendarCheck2, TrendingUp, ChevronRight } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard, description: "Overview & Analytics" },
  { to: "/admin/hotels", label: "Hotels", icon: Building2, description: "Manage Properties" },
  { to: "/admin/rooms", label: "Rooms", icon: BedSingle, description: "Room Inventory" },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck2, description: "Reservations" },
  { to: "/admin/payments", label: "Payments", icon: CreditCard, description: "Transactions" },
];

export default function Sidebar() {
  return (
    <nav className="space-y-2">
      <div className="px-3 py-2 mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Navigation
        </h2>
      </div>
      {navItems.map((n) => {
        const Icon = n.icon;
        return (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                )}>
                  {Icon && <Icon className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{n.label}</div>
                  <div className={cn(
                    "text-xs",
                    isActive ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {n.description}
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )} />
              </>
            )}
          </NavLink>
        );
      })}
      
      {/* Quick Stats */}

    </nav>
  );
}
