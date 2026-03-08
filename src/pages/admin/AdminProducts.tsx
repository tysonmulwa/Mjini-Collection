import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Upload, Camera, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Product = Tables<"products">;

const MAX_IMAGES = 5;

const emptyProduct = {
  name: "", category: "shoes", subcategory: "", shoe_type: "", price: 0, original_price: 0,
  image: "", images: [] as string[], description: "", sizes: [] as string[], colors: [] as string[],
  in_stock: true, is_new: false, on_sale: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFiles([]);
    setImagePreviews([]);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const existingImages = (p as any).images || [];
    const allImages = existingImages.length > 0 ? existingImages : (p.image ? [p.image] : []);
    setForm({
      name: p.name, category: p.category, subcategory: p.subcategory,
      shoe_type: (p as any).shoe_type || "",
      price: p.price, original_price: p.original_price, image: p.image,
      images: allImages,
      description: p.description || "", sizes: p.sizes || [], colors: p.colors || [],
      in_stock: p.in_stock ?? true, is_new: p.is_new ?? false, on_sale: p.on_sale ?? false,
    });
    setImageFiles([]);
    setImagePreviews(allImages);
    setDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    if (imagePreviews.length >= MAX_IMAGES) { toast.error(`Maximum ${MAX_IMAGES} images allowed`); return; }
    setImageFiles(prev => [...prev, file]);
    setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];
    // Check if this is a new file or existing URL
    const existingUrls = form.images;
    const isExisting = existingUrls.includes(preview);

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (!isExisting) {
      // Find which file index this corresponds to
      const newFileIndex = index - existingUrls.filter(url => imagePreviews.slice(0, index).includes(url)).length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    } else {
      setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => {
        // Remove the matching URL
        return prev.images[i] !== preview || imagePreviews.filter((p, pi) => pi < index && p === preview).length > 0;
      })}));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) { toast.error("Image upload failed: " + error.message); return null; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSave = async () => {
    if (!form.name || (imagePreviews.length === 0 && imageFiles.length === 0) || !form.price) {
      toast.error("Name, at least one image, and price are required");
      return;
    }
    setSaving(true);

    // Upload new files
    let allImageUrls: string[] = [];
    // Keep existing URLs that are still in previews
    const existingKept = form.images.filter(url => imagePreviews.includes(url));
    allImageUrls = [...existingKept];

    if (imageFiles.length > 0) {
      setUploading(true);
      for (const file of imageFiles) {
        if (file) {
          const uploaded = await uploadImage(file);
          if (!uploaded) { setSaving(false); setUploading(false); return; }
          allImageUrls.push(uploaded);
        }
      }
      setUploading(false);
    }

    const primaryImage = allImageUrls[0] || form.image;

    const payload = {
      name: form.name, category: form.category, subcategory: form.subcategory || form.category,
      shoe_type: form.shoe_type || null,
      price: form.price, original_price: form.original_price || form.price, image: primaryImage,
      images: allImageUrls,
      description: form.description || null, sizes: form.sizes.length ? form.sizes : null,
      colors: form.colors.length ? form.colors : null,
      in_stock: form.in_stock, is_new: form.is_new, on_sale: form.on_sale,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Product created");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    fetchProducts();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Products</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="gradient-brand text-primary-foreground shrink-0">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editing ? "Edit Product" : "New Product"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                
                {/* Smart Category & Subcategory Selection */}
                <div>
                  <Label className="mb-2 block">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "shoes", label: "👠 Shoes" },
                      { value: "beauty", label: "💄 Beauty" },
                      { value: "accessories", label: "👜 Accessories" },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.value, subcategory: "" })}
                        className={`px-4 py-2 rounded-lg border text-sm font-body transition-all ${
                          form.category === cat.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Who is it for?</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "men", label: "👨 Men" },
                      { value: "women", label: "👩 Women" },
                      { value: "kids", label: "🧒 Kids" },
                      { value: "unisex", label: "🌟 Unisex" },
                    ].map((sub) => (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => setForm({ ...form, subcategory: sub.value })}
                        className={`px-4 py-2 rounded-lg border text-sm font-body transition-all ${
                          form.subcategory === sub.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                  {form.category && form.subcategory && (
                    <p className="text-xs text-primary font-medium mt-2">
                      ✓ {form.subcategory === "men" ? "Men's" : form.subcategory === "women" ? "Women's" : form.subcategory === "kids" ? "Kids'" : "Unisex"} {form.category}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price (KES)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
                  <div><Label>Original Price</Label><Input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: +e.target.value })} /></div>
                </div>

                {/* Multi-image upload section */}
                <div>
                  <Label>Product Images ({imagePreviews.length}/{MAX_IMAGES})</Label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                              Main
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imagePreviews.length < MAX_IMAGES && (
                    <div className="mt-2 flex gap-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" /> {imagePreviews.length === 0 ? "Choose File" : "Add More"}
                      </Button>
                      <Button type="button" variant="outline" className="flex-1" onClick={() => cameraInputRef.current?.click()}>
                        <Camera className="w-4 h-4 mr-2" /> Take Photo
                      </Button>
                    </div>
                  )}
                  {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading images...</p>}
                  <p className="text-xs text-muted-foreground mt-1">First image will be the main product photo. Up to {MAX_IMAGES} images.</p>
                </div>

                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div>
                  <Label>Sizes</Label>
                  {form.category === "shoes" ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"].map((s) => (
                        <button
                          key={s} type="button"
                          onClick={() => setForm((prev) => ({ ...prev, sizes: prev.sizes.includes(s) ? prev.sizes.filter((x) => x !== s) : [...prev.sizes, s] }))}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-body transition-all ${form.sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}
                        >{s}</button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["S", "M", "L", "XL", "One Size"].map((s) => (
                        <button
                          key={s} type="button"
                          onClick={() => setForm((prev) => ({ ...prev, sizes: prev.sizes.includes(s) ? prev.sizes.filter((x) => x !== s) : [...prev.sizes, s] }))}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-body transition-all ${form.sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}
                        >{s}</button>
                      ))}
                    </div>
                  )}
                  {form.sizes.length > 0 && <p className="text-xs text-muted-foreground mt-1.5">Selected: {form.sizes.join(", ")}</p>}
                </div>
                <div>
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" },
                      { name: "Red", hex: "#EF4444" }, { name: "Pink", hex: "#EC4899" },
                      { name: "Blue", hex: "#3B82F6" }, { name: "Navy", hex: "#1E3A5F" },
                      { name: "Brown", hex: "#92400E" }, { name: "Tan", hex: "#D2B48C" },
                      { name: "Beige", hex: "#F5F5DC" }, { name: "Gold", hex: "#D4AF37" },
                      { name: "Silver", hex: "#C0C0C0" }, { name: "Green", hex: "#22C55E" },
                      { name: "Purple", hex: "#A855F7" }, { name: "Orange", hex: "#F97316" },
                      { name: "Nude", hex: "#E8C4A0" }, { name: "Maroon", hex: "#800000" },
                    ].map((c) => (
                      <button
                        key={c.name} type="button"
                        onClick={() => setForm((prev) => ({ ...prev, colors: prev.colors.includes(c.name) ? prev.colors.filter((x) => x !== c.name) : [...prev.colors, c.name] }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-body transition-all ${form.colors.includes(c.name) ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary" : "border-border text-muted-foreground hover:border-primary"}`}
                      >
                        <span className="w-4 h-4 rounded-full shrink-0 border border-border" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                  {form.colors.length > 0 && <p className="text-xs text-muted-foreground mt-1.5">Selected: {form.colors.join(", ")}</p>}
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} /> In Stock</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> New</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.on_sale} onChange={(e) => setForm({ ...form, on_sale: e.target.checked })} /> On Sale</label>
                </div>
                <Button onClick={handleSave} disabled={saving || uploading} className="w-full gradient-brand text-primary-foreground">
                  {uploading ? "Uploading..." : saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                    <div>
                      <span className="font-medium text-foreground text-sm line-clamp-1">{p.name}</span>
                      {(p as any).images?.length > 1 && (
                        <span className="text-xs text-muted-foreground">{(p as any).images.length} photos</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell capitalize text-muted-foreground text-sm">{p.category}</TableCell>
                <TableCell className="text-sm font-medium">KES {p.price.toLocaleString()}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex gap-1">
                    {p.in_stock ? <Badge variant="secondary" className="text-xs">In Stock</Badge> : <Badge variant="destructive" className="text-xs">Out</Badge>}
                    {p.is_new && <Badge className="bg-primary/10 text-primary text-xs">New</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No products found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
