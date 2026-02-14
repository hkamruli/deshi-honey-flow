import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      // Check admin role
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
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>অ্যাডমিন লগইন</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>ইমেইল</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>পাসওয়ার্ড</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "লগইন হচ্ছে..." : "লগইন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminLogin;
