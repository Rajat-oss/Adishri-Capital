import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Landmark, MoreVertical, X, Settings, LogOut, LayoutDashboard, Search, FileText, Home, UserCircle, Menu } from "lucide-react";
import { ROUTES } from "../../../utils/constants";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "Apply Now", href: ROUTES.LOAN_APPLICATION, icon: FileText },
  { label: "Track Loan", href: ROUTES.USER_DASHBOARD, icon: Search },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* ─ TOP HEADER (Desktop & Mobile) ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 bg-[#102777] rounded-xl flex items-center justify-center shadow-md ring-4 ring-[#102777]/5 transition-transform duration-300">
                <Landmark className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-xl text-[#102777] tracking-tight">
                Adishri <span className="text-[#E66325]">Capitals</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-1">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                        active ? "bg-[#102777]/5 text-[#102777]" : "text-slate-600 hover:bg-slate-50 hover:text-[#E66325]"
                      }`}
                    >
                      <link.icon size={16} strokeWidth={active ? 2.5 : 2} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="w-px h-6 bg-slate-200" />

              {/* User Dropdown / Quick Actions */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-[#102777]/10 text-slate-600 hover:text-[#102777] transition-all duration-300"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle user menu"
                >
                  {user ? <UserCircle size={24} /> : <Menu size={20} />}
                </button>

                {/* Desktop Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute top-14 right-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(16,39,119,0.1)] p-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 mb-2 border-b border-slate-50">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account & Info</p>
                    </div>

                    {user ? (
                      <div className="space-y-1">
                        <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Logged in as</p>
                          <p className="text-sm font-bold text-[#102777] truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            to={ROUTES.ADMIN_DASHBOARD}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-[#FBFBFB] hover:text-[#102777] transition-all"
                          >
                            <LayoutDashboard size={18} />
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          to={ROUTES.USER_DASHBOARD}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-[#FBFBFB] hover:text-[#102777] transition-all"
                        >
                          <Search size={18} />
                          My Applications
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-3 mt-2 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="px-4 py-2 text-sm text-slate-500 font-medium">Log in to track your loan status or apply instantly.</p>
                        <div className="mt-4 p-2">
                          <button
                            onClick={() => handleNav(ROUTES.LOAN_APPLICATION)}
                            className="flex items-center justify-center h-12 w-full bg-[#E66325] hover:bg-[#D4541B] text-white font-black rounded-2xl text-sm transition-all shadow-lg active:scale-95"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Contact or simple button if needed (optional) */}
            <div className="md:hidden flex items-center">
               {!user && (
                  <Link
                    to={ROUTES.LOAN_APPLICATION}
                    className="text-xs font-bold bg-[#E66325]/10 text-[#E66325] px-4 py-2 rounded-full uppercase tracking-wider"
                  >
                    Apply
                  </Link>
               )}
            </div>
            
          </div>
        </div>
      </header>

      {/* ─ MOBILE BOTTOM APP BAR ────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-[72px] px-2">
          
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 p-1`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-300 ${active ? "bg-[#102777]/10 text-[#102777]" : "text-slate-400"}`}>
                  <link.icon size={22} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold ${active ? "text-[#102777]" : "text-slate-400"}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* More / User Menu Tab */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 p-1 ${menuOpen ? "text-[#E66325]" : "text-slate-400"}`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-300 ${menuOpen ? "bg-[#E66325]/10" : ""}`}>
               <UserCircle size={22} strokeWidth={menuOpen ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${menuOpen ? "text-[#E66325]" : ""}`}>
              {user ? "Account" : "More"}
            </span>
          </button>
          
        </div>
      </nav>

      {/* ─ MOBILE BOTTOM SHEET MENU (Overlay) ─────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setMenuOpen(false)} 
          />
          
          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-[2.5rem] shadow-2xl p-6 pb-12 animate-in slide-in-from-bottom-[100%] duration-300 sm:rounded-3xl sm:max-w-sm sm:mb-8 sm:w-11/12 border border-slate-100">
             
             {/* Notch */}
             <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden" />
             
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#102777]">Account Options</h3>
                <button onClick={() => setMenuOpen(false)} className="p-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-full">
                  <X size={20} />
                </button>
             </div>

             {user ? (
               <div className="space-y-3">
                 <div className="p-5 bg-gradient-to-br from-[#102777]/5 to-[#2DAAA5]/5 rounded-3xl border border-[#102777]/10 mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Signed In</p>
                    <p className="text-base font-bold text-[#102777] truncate">{user.email}</p>
                 </div>
                 
                 {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-700 font-bold active:bg-slate-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#102777]/5 text-[#102777] flex items-center justify-center">
                        <LayoutDashboard size={18} />
                      </div>
                      Admin Panel
                    </Link>
                 )}
                 <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="flex items-center gap-4 p-4 w-full rounded-2xl bg-white border border-slate-100 shadow-sm text-red-500 font-bold active:bg-red-50 text-left"
                 >
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <LogOut size={18} />
                    </div>
                    Log out securely
                 </button>
               </div>
             ) : (
               <div className="space-y-6">
                  <p className="text-slate-500 font-medium text-sm text-center px-4">
                    Track your loan status and manage applications seamlessly.
                  </p>
                  <button
                    onClick={() => handleNav(ROUTES.LOAN_APPLICATION)}
                    className="flex items-center justify-center h-14 w-full bg-[#E66325] text-white font-black rounded-full text-lg shadow-xl shadow-[#E66325]/20 active:scale-95 transition-transform"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => handleNav(ROUTES.USER_DASHBOARD)}
                    className="flex items-center justify-center h-14 w-full bg-white border-2 border-[#102777] text-[#102777] font-bold rounded-full text-lg active:bg-slate-50"
                  >
                    Login / Track Loan
                  </button>
               </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}