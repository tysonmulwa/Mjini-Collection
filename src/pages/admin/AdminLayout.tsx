import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ShoppingBag, LayoutDashboard, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
{ to: "/admin", label: "Dashboard", icon: LayoutDashboard },
{ to: "/admin/products", label: "Products", icon: Package },
{ to: "/admin/orders", label: "Orders", icon: ShoppingBag }];


const AdminLayout = () => {
  const { isAdmin, loading } = useAdmin();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>);

  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-foreground">Sign In Required</h1>
          <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
          <Button onClick={() => navigate("/login")} className="gradient-brand text-primary-foreground">Sign In</Button>
        </div>
      </div>);

  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
          <Link to="/"><Button variant="outline">Back to Store</Button></Link>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 gradient-brand rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-display text-2xl font-extrabold">​T</span>
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-foreground leading-tight">​TYSON-Admin </h1>
              
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ?
                "bg-primary/10 text-primary font-semibold" :
                "text-muted-foreground hover:text-foreground hover:bg-muted"}`
                }>
                
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>);

          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="text-sm text-muted-foreground flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Store</Link>
          <span className="font-display font-bold text-foreground">Admin</span>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <Button variant={active ? "default" : "ghost"} size="icon" className={active ? "gradient-brand text-primary-foreground" : ""}>
                    <item.icon className="w-4 h-4" />
                  </Button>
                </Link>);

            })}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>);

};

export default AdminLayout;