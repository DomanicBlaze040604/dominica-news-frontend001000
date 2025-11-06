import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Edit, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PagesManager = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    metaDescription: "",
  });

  // Sample static pages - in production, fetch from API
  const pages = [
    { id: 1, title: "About Us", slug: "about", updatedAt: "2025-11-05" },
    { id: 2, title: "Contact Us", slug: "contact", updatedAt: "2025-11-04" },
    { id: 3, title: "Privacy Policy", slug: "privacy", updatedAt: "2025-11-03" },
    { id: 4, title: "Terms of Service", slug: "terms", updatedAt: "2025-11-03" },
    { id: 5, title: "Editorial Team", slug: "editorial-team", updatedAt: "2025-11-02" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "title") {
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
      title: "Page Created",
      description: `"${formData.title}" has been created successfully.`,
    });
    setIsDialogOpen(false);
    setFormData({ title: "", slug: "", content: "", metaDescription: "" });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Static Pages</h1>
            <p className="text-muted-foreground">Create and manage static website pages</p>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Page
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Page Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., About Us"
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Page will be available at: /{formData.slug || "page-slug"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="Page content (HTML supported)"
                      rows={12}
                      className="font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports HTML and Markdown
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      placeholder="Brief description for search engines"
                      rows={2}
                      maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Page</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="interactive-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">{page.title}</CardTitle>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-mono">/{page.slug}</span>
                          <span>•</span>
                          <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  };

export default PagesManager;
