import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";

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
          <Sidebar />

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}