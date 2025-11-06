import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  trend?: ReactNode;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  trend,
}: StatsCardProps) {
  const changeColors = {
    increase: "text-green-600 dark:text-green-400",
    decrease: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="interactive-card hover-lift overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {change && (
                <span className={`text-xs font-medium ${changeColors[changeType]}`}>
                  {changeType === "increase" && "↑"}
                  {changeType === "decrease" && "↓"}
                  {change}
                </span>
              )}
            </div>
            {trend && <div className="text-xs text-muted-foreground">{trend}</div>}
          </div>
          <div className={`p-3 rounded-xl bg-muted ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
