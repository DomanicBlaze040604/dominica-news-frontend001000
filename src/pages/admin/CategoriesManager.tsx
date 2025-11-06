import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CategoriesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    icon: "layers",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories = data?.success ? data.data : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: editingCategory ? "Category Updated" : "Category Created",
      description: `"${formData.name}" has been ${editingCategory ? 'updated' : 'created'} successfully.`,
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      icon: "layers",
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "#3B82F6",
      icon: category.icon || "layers",
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Categories</h1>
            <p className="text-muted-foreground">Manage article categories</p>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={resetForm}>
                  <PlusCircle className="h-4 w-4" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Breaking News"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange("slug", e.target.value)}
                      placeholder="auto-generated"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief description of this category"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="color"
                          type="color"
                          value={formData.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          value={formData.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          placeholder="#3B82F6"
                          className="flex-1 font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => handleInputChange("icon", e.target.value)}
                        placeholder="layers"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCategory ? "Update" : "Create"} Category
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading categories...</p>
              </Card>
            ) : categories.length > 0 ? (
              categories.map((category: any) => (
                <Card key={category.id} className="interactive-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Layers className="h-5 w-5" style={{ color: category.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-1">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.description || "No description"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              /{category.slug}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: category.color, color: category.color }}
                            >
                              {category.color}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No categories yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Create Your First Category
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  };

export default CategoriesManager;
