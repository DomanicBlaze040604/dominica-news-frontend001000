import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ApiStatus from "@/components/ApiStatus";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Layers, 
  Share2, 
  AlertCircle, 
  PlusCircle,
  Users,
  Eye,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { articlesApi } from "@/lib/api";

const AdminDashboard = () => {
  // Fetch recent articles for activity feed
  const { data: articlesData } = useQuery({
    queryKey: ["admin", "recent-articles"],
    queryFn: () => articlesApi.getAll({ limit: 5 }),
  });

  const recentArticles = articlesData?.success ? articlesData.data : [];

  const quickActions = [
    {
      title: "Create Article",
      description: "Write a new news article",
      icon: FileText,
      link: "/admin/articles/new",
      color: "text-blue-500",
    },
    {
      title: "Add Breaking News",
      description: "Post urgent alert",
      icon: AlertCircle,
      link: "/admin/breaking-news",
      color: "text-red-500",
    },
    {
      title: "New Category",
      description: "Create article category",
      icon: Layers,
      link: "/admin/categories",
      color: "text-green-500",
    },
    {
      title: "Manage Social",
      description: "Update social links",
      icon: Share2,
      link: "/admin/social-media",
      color: "text-pink-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your news site.
          </p>
        </div>

        {/* API Status */}
        <ApiStatus />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Articles"
            value="248"
            change="+12%"
            changeType="increase"
            icon={FileText}
            iconColor="text-blue-500"
            trend="vs last month"
          />
          <StatsCard
            title="Total Views"
            value="24.5K"
            change="+8%"
            changeType="increase"
            icon={Eye}
            iconColor="text-green-500"
            trend="This month"
          />
          <StatsCard
            title="Active Authors"
            value="7"
            change="+2"
            changeType="increase"
            icon={Users}
            iconColor="text-purple-500"
            trend="New this month"
          />
          <StatsCard
            title="Engagement"
            value="94%"
            change="+5%"
            changeType="increase"
            icon={TrendingUp}
            iconColor="text-orange-500"
            trend="Avg. read time: 3.2min"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used actions for faster workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.link} to={action.link}>
                      <Card className="interactive-card hover-lift cursor-pointer transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1">{action.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {action.description}
                              </p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentArticles.length > 0 ? (
                  recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <div className="p-1.5 rounded bg-primary/10">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={article.status === 'published' ? 'default' : 'secondary'}
                              className="text-[10px] h-4 px-1"
                            >
                              {article.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Articles
            </CardTitle>
            <CardDescription>Most viewed articles this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">
                      Sample Article Title #{index}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 5000 + 1000)} views
                    </p>
                  </div>
                  <Badge variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    {Math.floor(Math.random() * 100 + 50)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
