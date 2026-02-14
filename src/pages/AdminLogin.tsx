import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (!roles || roles.role !== "admin") {
        await supabase.auth.signOut();
        setError("আপনার অ্যাডমিন অ্যাক্সেস নেই।");
        return;
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "লগইন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg, hsl(25 20% 8%) 0%, hsl(16 60% 18%) 40%, hsl(30 70% 25%) 100%)" }}>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 honeycomb-pattern opacity-30" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍯</div>
          <h1 className="text-3xl font-bold text-cream">দেশি ফুডস</h1>
          <p className="text-cream/50 text-sm mt-1">অ্যাডমিন প্যানেল</p>
        </div>

        {/* Login Card */}
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-primary/10 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-honey flex items-center justify-center shadow-lg">
              <Lock className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-center mb-1">অ্যাডমিন লগইন</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="text-sm font-semibold">ইমেইল</Label>
              <Input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 bg-muted/50 border-border/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">পাসওয়ার্ড</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted/50 border-border/50 focus:border-primary transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-honey text-primary-foreground font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" /></svg>
                  লগইন হচ্ছে...
                </span>
              ) : (
                "লগইন করুন"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-cream/30 text-xs mt-6">© দেশি ফুডস — সর্বস্বত্ব সংরক্ষিত</p>
      </div>
    </main>
  );
};

export default AdminLogin;
