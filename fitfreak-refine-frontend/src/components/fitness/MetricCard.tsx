import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  target?: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  progress?: number;
  color?: "primary" | "success" | "warning" | "info";
  className?: string;
  onAdd?: () => void;
  onView?: () => void;
  children?: React.ReactNode;
}

const colorMap = {
  primary: {
    icon: "text-primary",
    bg: "bg-primary/10",
    progress: "bg-primary",
  },
  success: {
    icon: "text-success",
    bg: "bg-success/10", 
    progress: "bg-success",
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/10",
    progress: "bg-warning",
  },
  info: {
    icon: "text-info",
    bg: "bg-info/10",
    progress: "bg-info",
  },
};

export function MetricCard({
  title,
  value,
  target,
  unit,
  icon: Icon,
  trend,
  trendValue,
  progress,
  color = "primary",
  className,
  onAdd,
  onView,
  children,
}: MetricCardProps) {
  const colors = colorMap[color];
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  
  return (
    <Card className={cn("animate-fade-in hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", colors.bg)}>
          <Icon className={cn("h-4 w-4", colors.icon)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Main Value */}
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold">
              {value}
              {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
            </div>
          </div>

          {/* Target & Progress */}
          {target && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Goal: {target}{unit}</span>
                {progress !== undefined && <span>{Math.round(progress)}%</span>}
              </div>
              {progress !== undefined && (
                <Progress 
                  value={progress} 
                  className="h-2"
                  // Apply custom color class
                />
              )}
            </div>
          )}

          {/* Trend */}
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <TrendIcon className={cn(
                "h-3 w-3",
                trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}>
                {trendValue}
              </span>
            </div>
          )}

          {/* Custom Content */}
          {children}

          {/* Actions */}
          {(onAdd || onView) && (
            <div className="flex gap-2 pt-2">
              {onAdd && (
                <Button size="sm" className="flex-1">
                  Add
                </Button>
              )}
              {onView && (
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}