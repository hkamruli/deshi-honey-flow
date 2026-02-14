import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  Package,
  MessageSquare,
  Tag,
  Settings,
  Home,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { id: "orders", label: "অর্ডার", icon: ShoppingCart },
  { id: "abandoned", label: "অসম্পূর্ণ অর্ডার", icon: AlertTriangle },
  { id: "products", label: "প্রোডাক্ট", icon: Package },
  { id: "testimonials", label: "টেস্টিমোনিয়াল", icon: MessageSquare },
  { id: "offers", label: "অফার", icon: Tag },
  { id: "settings", label: "সেটিংস", icon: Settings },
];

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: Props) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍯</span>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold leading-tight truncate">আডমিন প্যানেল</h2>
            </div>
          )}
        </div>
      </div>

      {/* Menu label */}
      {!collapsed && (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-4 pt-4 pb-1 font-semibold">মেন্যু</p>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSectionChange(item.id);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border/50 p-3 space-y-2">
        {!collapsed && userEmail && (
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            <p className="text-[10px] text-muted-foreground/60">Admin</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => window.open("/", "_blank")}
        >
          <Home className="h-4 w-4" />
          {!collapsed && "সাইট দেখুন"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "লগআউট"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-card border border-border/50 shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <aside
            className="w-64 h-full bg-card border-r border-border/50 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-card border-r border-border/50 transition-all duration-300 ${
          collapsed ? "w-[60px]" : "w-[220px]"
        }`}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/50 shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className={`h-3 w-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
