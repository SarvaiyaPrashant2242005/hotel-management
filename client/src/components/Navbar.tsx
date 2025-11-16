import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHotel } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Hotels", path: "/hotels" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ] as const;

  const isActive = (path: string) => location.pathname === path;

  const [user, setUser] = useState<{ fullName?: string } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaHotel className="text-3xl text-teal-400" />
            </motion.div>
            <span className="text-2xl font-bold text-teal-400">
              StayEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors hover:text-teal-300 ${
                  isActive(link.path)
                    ? "text-teal-400"
                    : "text-teal-400/80"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
{user?.fullName ? (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-teal-400">
      Hi, {user.fullName}
    </span>
    <Link to="/my-bookings">
      <Button
        variant="ghost"
        className="text-teal-400 hover:text-teal-300 border border-teal-400 hover:border-teal-300"
      >
        My Bookings
      </Button>
    </Link>
    <Button
      variant="ghost"
      className="text-teal-400 hover:text-teal-300 border border-teal-400 hover:border-teal-300"
      onClick={handleLogout}
    >
      Logout
    </Button>
  </div>
) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-teal-400 hover:text-teal-300 border border-teal-400 hover:border-teal-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-teal-400 hover:bg-teal-300 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-teal-400"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 font-medium transition-colors hover:text-teal-300 ${
                  isActive(link.path)
                    ? "text-teal-400"
                    : "text-teal-400/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {user?.fullName ? (
  <div className="w-full text-center py-2 font-medium text-teal-400 flex items-center justify-center gap-3">
    <span>Hi, {user.fullName}</span>
    <Link
      to="/my-bookings"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Button
        variant="outline"
        className="text-teal-400 border border-teal-400 hover:text-teal-300 hover:border-teal-300 mr-2"
      >
        My Bookings
      </Button>
    </Link>
    <Button
      variant="outline"
      className="text-teal-400 border border-teal-400 hover:text-teal-300 hover:border-teal-300"
      onClick={() => {
        handleLogout();
        setIsMobileMenuOpen(false);
      }}
    >
      Logout
    </Button>
  </div>
) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full text-teal-400 border border-teal-400 hover:text-teal-300 hover:border-teal-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-teal-400 hover:bg-teal-300 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
