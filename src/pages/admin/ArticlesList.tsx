import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ArticlesList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: () => articlesApi.getAll({ limit: 50 }),
  });

  const articles = data?.success ? data.data : [];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Articles</h1>
            <p className="text-muted-foreground">Manage all news articles</p>
          </div>
          <Link to="/admin/articles/new">
            <Button className="gap-2 hover-scale">
              <PlusCircle className="h-4 w-4" />
              Create Article
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="interactive-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                          {article.status}
                        </Badge>
                        {article.isPinned && <Badge variant="destructive">Pinned</Badge>}
                        {article.isFeatured && <Badge className="bg-yellow-500">Featured</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span>{article.author.name}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                        {article.views && article.views > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {article.views} views
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/admin/articles/edit/${article.id}`}>
                        <Button variant="outline" size="sm" className="hover-scale">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-destructive hover-scale">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {article.excerpt && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
            
            {articles.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No articles yet</p>
                <Link to="/admin/articles/new">
                  <Button>Create Your First Article</Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticlesList;
