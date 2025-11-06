import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePerformanceMetrics, performanceMonitor } from '@/utils/performanceMonitoring';
import { Activity, Clock, Zap, BarChart3, RefreshCw } from 'lucide-react';

/**
 * Performance Dashboard for development monitoring
 * Only renders in development mode
 */
const PerformanceDashboard: React.FC = () => {
  const metrics = usePerformanceMetrics();
  const [isVisible, setIsVisible] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<{
    score: number;
    grade: string;
    recommendations: string[];
  }>({ score: 0, grade: 'N/A', recommendations: [] });

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  useEffect(() => {
    const updateScore = () => {
      setPerformanceScore(performanceMonitor.getPerformanceScore());
    };

    updateScore();
    const interval = setInterval(updateScore, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time?: number) => {
    if (!time) return 'N/A';
    return `${time.toFixed(2)}ms`;
  };

  const formatMemory = (bytes?: number) => {
    if (!bytes) return 'N/A';
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    if (score >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCoreWebVitalStatus = (metric: string, value?: number) => {
    if (!value) return 'secondary';
    
    switch (metric) {
      case 'fcp':
        return value <= 1800 ? 'default' : value <= 3000 ? 'secondary' : 'destructive';
      case 'lcp':
        return value <= 2500 ? 'default' : value <= 4000 ? 'secondary' : 'destructive';
      case 'cls':
        return value <= 0.1 ? 'default' : value <= 0.25 ? 'secondary' : 'destructive';
      case 'fid':
        return value <= 100 ? 'default' : value <= 300 ? 'secondary' : 'destructive';
      default:
        return 'secondary';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg"
        >
          <Activity className="h-4 w-4 mr-2" />
          Performance
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => performanceMonitor.generateReport()}
                size="sm"
                variant="ghost"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Performance Score */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(performanceScore.score)}`} />
            <span className="font-semibold">
              Score: {performanceScore.score}/100 ({performanceScore.grade})
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Core Web Vitals */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Core Web Vitals
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>FCP:</span>
                <Badge variant={getCoreWebVitalStatus('fcp', metrics.firstContentfulPaint)}>
                  {formatTime(metrics.firstContentfulPaint)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>LCP:</span>
                <Badge variant={getCoreWebVitalStatus('lcp', metrics.largestContentfulPaint)}>
                  {formatTime(metrics.largestContentfulPaint)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>CLS:</span>
                <Badge variant={getCoreWebVitalStatus('cls', metrics.cumulativeLayoutShift)}>
                  {(metrics.cumulativeLayoutShift || 0).toFixed(3)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>FID:</span>
                <Badge variant={getCoreWebVitalStatus('fid', metrics.firstInputDelay)}>
                  {formatTime(metrics.firstInputDelay)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Loading Performance */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Loading Times
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>DOM Ready:</span>
                <span>{formatTime(metrics.domContentLoaded)}</span>
              </div>
              <div className="flex justify-between">
                <span>Load Complete:</span>
                <span>{formatTime(metrics.loadComplete)}</span>
              </div>
              <div className="flex justify-between">
                <span>Font Load:</span>
                <span>{formatTime(metrics.fontLoadTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>Image Load:</span>
                <span>{formatTime(metrics.imageLoadTime)}</span>
              </div>
            </div>
          </div>

          {/* User Interactions */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Interactions
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Click Response:</span>
                <span>{formatTime(metrics.clickResponseTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>API Response:</span>
                <span>{formatTime(metrics.apiResponseTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>Resources:</span>
                <span>{metrics.totalResources || 0}</span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage && (
            <div>
              <h4 className="font-semibold mb-2">Memory Usage</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>{formatMemory(metrics.memoryUsage.usedJSHeapSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatMemory(metrics.memoryUsage.totalJSHeapSize)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {performanceScore.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <div className="space-y-1">
                {performanceScore.recommendations.map((rec, index) => (
                  <div key={index} className="text-xs p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;