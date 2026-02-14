import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, MessageSquare, Check, Trash2, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AbandonedCart {
  id: string;
  session_id: string | null;
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  district_id: string | null;
  area: string | null;
  full_address: string | null;
  product_variation_id: string | null;
  quantity: number;
  is_converted: boolean;
  contacted: boolean;
  contact_notes: string | null;
  created_at: string;
}

const AbandonedCarts = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [notes, setNotes] = useState("");

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("abandoned_carts")
      .select("*")
      .eq("is_converted", false)
      .order("created_at", { ascending: false })
      .limit(100);
    setCarts((data as any[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCarts(); }, [fetchCarts]);

  const markContacted = async (id: string, contactNotes: string) => {
    await supabase.from("abandoned_carts").update({
      contacted: true,
      contact_notes: contactNotes,
    } as any).eq("id", id);
    setSelectedCart(null);
    setNotes("");
    fetchCarts();
  };

  const markConverted = async (id: string) => {
    await supabase.from("abandoned_carts").update({ is_converted: true } as any).eq("id", id);
    fetchCarts();
  };

  const deleteCart = async (id: string) => {
    await supabase.from("abandoned_carts").delete().eq("id", id);
    fetchCarts();
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-destructive" />
            অসম্পূর্ণ অর্ডার ({carts.length})
          </CardTitle>
          <p className="text-xs text-muted-foreground">যারা ফর্ম পূরণ করেছেন কিন্তু অর্ডার সাবমিট করেননি</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</p>
          ) : carts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">কোনো অসম্পূর্ণ অর্ডার নেই 🎉</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>নাম</TableHead>
                    <TableHead>ফোন</TableHead>
                    <TableHead>ইমেইল</TableHead>
                    <TableHead>সময়</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carts.map((cart) => (
                    <TableRow key={cart.id} className={cart.contacted ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{cart.customer_name || "—"}</TableCell>
                      <TableCell>
                        {cart.phone ? (
                          <a href={`tel:${cart.phone}`} className="text-blue-600 hover:underline">{cart.phone}</a>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">{cart.email || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(cart.created_at).toLocaleString("bn-BD", { day: "numeric", month: "short", hour: "numeric", minute: "numeric" })}
                      </TableCell>
                      <TableCell>
                        {cart.contacted ? (
                          <Badge variant="secondary" className="text-xs">যোগাযোগ হয়েছে</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">নতুন</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          {cart.phone && (
                            <Button variant="ghost" size="icon" asChild title="কল করুন">
                              <a href={`tel:${cart.phone}`}><Phone className="h-4 w-4" /></a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCart(cart); setNotes(cart.contact_notes || ""); }} title="নোট">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => markConverted(cart.id)} title="অর্ডারে রূপান্তরিত">
                            <Check className="h-4 w-4 text-secondary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCart(cart.id)} title="মুছুন">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Notes Modal */}
      <Dialog open={!!selectedCart} onOpenChange={() => setSelectedCart(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>যোগাযোগ নোট — {selectedCart?.customer_name || "অজানা"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCart?.phone && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${selectedCart.phone}`}><Phone className="h-4 w-4 mr-1" /> কল</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://wa.me/88${selectedCart.phone}`} target="_blank" rel="noopener noreferrer">
                    💬 WhatsApp
                  </a>
                </Button>
              </div>
            )}
            <div>
              <Label>নোট</Label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যোগাযোগের বিস্তারিত লিখুন..."
              />
            </div>
            <Button onClick={() => selectedCart && markContacted(selectedCart.id, notes)} className="w-full">
              <Check className="h-4 w-4 mr-1" /> যোগাযোগ হয়েছে হিসেবে চিহ্নিত করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AbandonedCarts;
