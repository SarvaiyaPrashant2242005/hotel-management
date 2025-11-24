import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                H
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Hotel Admin</h1>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.fullName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user.fullName || "Admin"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role || "admin"}</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link to="/home">
                <Home className="w-4 h-4 mr-2" />
                Back to Site
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar - Desktop (Always visible on desktop) */}
        <aside className="hidden md:flex w-64 border-r bg-white dark:bg-slate-900 shadow-sm">
          <div className="w-full p-4 overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 z-40 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          >
            <div 
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-4">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-x-hidden">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}