import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { articlesApi, authorsApi, categoriesApi, uploadsApi } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    body: "",
    imageAlt: "",
    metaTitle: "",
    metaDescription: "",
    author: "",
    status: "draft",
    pinned: false
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch categories and authors from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: authorsData } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorsApi.getAll({ limit: 50 }),
  });

  const categories = categoriesData?.success ? categoriesData.data : [];
  const authors = authorsData?.success ? authorsData.data : [];

  // Mutation for creating article
  const createArticleMutation = useMutation({
    mutationFn: articlesApi.create,
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: `Article "${formData.title}" has been ${formData.status === "published" ? "published" : "saved as draft"}.`,
      });
      navigate(`/article/${data.data.slug}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create article",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-upload the image
      setIsUploading(true);
      try {
        const result = await uploadsApi.uploadFile(file);
        if (result.success && result.url) {
          setUploadedImageUrl(result.url);
          toast({
            title: "Image Uploaded",
            description: "Cover image uploaded successfully!",
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. You can still submit the article.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === "title" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.body || !formData.author) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Body, Author)",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedCategories.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one category",
        variant: "destructive"
      });
      return;
    }

    // Prepare article data
    const articleData = {
      title: formData.title,
      slug: formData.slug || undefined,
      excerpt: formData.summary,
      content: formData.body,
      featuredImage: uploadedImageUrl || undefined,
      featuredImageAlt: formData.imageAlt,
      authorId: formData.author,
      categoryId: selectedCategories[0], // Use first category
      status: formData.status as 'draft' | 'published',
      isPinned: formData.pinned,
      isFeatured: formData.pinned, // Set featured if pinned
      seo: {
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      },
    };

    createArticleMutation.mutate(articleData);
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Article preview would open in a new tab",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                Create New Article
              </h1>
              <p className="text-muted-foreground">
                Write and publish your news story to Dominica News
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>

          {/* API Status Indicator */}
          <ApiStatus />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>
                  Upload a high-quality image for your article (recommended: 1200x600px)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? "border-primary bg-primary/5 scale-105" 
                      : "border-border hover:border-primary hover:bg-muted"
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Cover preview" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? "Drop your image here" : isUploading ? "Uploading..." : "Drag & Drop your files or Browse"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Supports: JPG, PNG, GIF, WebP (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="imageAlt">Image Alt Text (for SEO & Accessibility)</Label>
                  <Input
                    id="imageAlt"
                    placeholder="Describe the image for screen readers and SEO"
                    value={formData.imageAlt}
                    onChange={(e) => handleInputChange("imageAlt", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Article Details */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-base">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-2 text-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-base">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="article-url-slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-generated from title, but you can customize it
                  </p>
                </div>

                <div>
                  <Label htmlFor="summary" className="text-base">Summary / Excerpt</Label>
                  <Textarea
                    id="summary"
                    placeholder="Brief summary of the article (shown in cards and previews)"
                    value={formData.summary}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    className="mt-2 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="body" className="text-base">
                    Article Body <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="body"
                    placeholder="Write your article content here..."
                    value={formData.body}
                    onChange={(e) => handleInputChange("body", e.target.value)}
                    className="mt-2 min-h-[400px] font-serif"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports rich text formatting (in production would use a WYSIWYG editor)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Author & Categories */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Author & Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author" className="text-base">
                    Author <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.author}
                    onValueChange={(value) => handleInputChange("author", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                      {authors.length === 0 && (
                        <SelectItem value="loading" disabled>
                          Loading authors...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base">
                    Categories <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                        {selectedCategories.includes(category.id) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">Loading categories...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your article for search engines and social sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    placeholder="SEO-optimized title (defaults to article title)"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    className="mt-2"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    placeholder="Brief description for search results"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    className="mt-2 min-h-[80px]"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-base">Publication Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Not Published)</SelectItem>
                      <SelectItem value="published">Published (Live)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="pinned" className="text-base font-medium">
                      Pin as Featured Story
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      This article will appear in the Featured Story section on homepage
                    </p>
                  </div>
                  <Switch
                    id="pinned"
                    checked={formData.pinned}
                    onCheckedChange={(checked) => handleInputChange("pinned", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePreview}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                type="submit"
                size="lg"
                className="gap-2 hover-scale"
                disabled={createArticleMutation.isPending || isUploading}
              >
                <Save className="h-4 w-4" />
                {createArticleMutation.isPending 
                  ? "Saving..." 
                  : formData.status === "published" ? "Publish Article" : "Save Draft"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
