import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BreakingNewsManager = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    isActive: true,
    priority: "high",
  });

  // Sample breaking news - in production, fetch from API
  const breakingNews = [
    {
      id: 1,
      title: "Tropical Storm Warning Issued for Dominica",
      link: "/article/tropical-storm-warning",
      isActive: true,
      priority: "high",
      createdAt: "2025-11-06T10:00:00Z",
    },
    {
      id: 2,
      title: "Prime Minister Announces New Infrastructure Plan",
      link: "/article/infrastructure-plan",
      isActive: false,
      priority: "medium",
      createdAt: "2025-11-05T14:30:00Z",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Breaking News Added",
      description: `"${formData.title}" has been published.`,
    });
    setIsDialogOpen(false);
    setFormData({ title: "", link: "", isActive: true, priority: "high" });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              Breaking News
            </h1>
            <p className="text-muted-foreground">Manage urgent news alerts and breaking stories</p>
          </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-destructive hover:bg-destructive/90">
                  <AlertCircle className="h-4 w-4" />
                  Add Breaking News
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Breaking News Alert</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Alert Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Tropical Storm Warning Issued"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="link">Link to Article (optional)</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="/article/slug or full URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="high">High (Red Alert)</option>
                      <option value="medium">Medium (Orange Alert)</option>
                      <option value="low">Low (Yellow Alert)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="isActive" className="text-base font-medium">
                        Display on Site
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show this alert to visitors
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-destructive hover:bg-destructive/90">
                      Publish Alert
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {breakingNews.map((item) => (
              <Card key={item.id} className="interactive-card border-l-4 border-l-destructive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {item.isActive ? (
                          <Badge className="bg-green-500">Live</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            item.priority === "high"
                              ? "border-destructive text-destructive"
                              : item.priority === "medium"
                              ? "border-orange-500 text-orange-500"
                              : "border-yellow-500 text-yellow-500"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.link && (
                          <span className="font-mono text-xs">{item.link}</span>
                        )}
                        {item.link && " • "}
                        <span>
                          Created {new Date(item.createdAt).toLocaleString()}
                        </span>
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

            {breakingNews.length === 0 && (
              <Card className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No breaking news alerts</p>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-destructive">
                  Create First Alert
                </Button>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  };

export default BreakingNewsManager;
