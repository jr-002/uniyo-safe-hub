
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const DashboardSkeleton = () => {
  return (
    <PageContainer
      title="Loading Dashboard..."
      description="Please wait while we fetch your data."
      headerActions={<Skeleton className="h-10 w-36 rounded-lg" />}
      className="px-6 pb-8 space-y-8"
    >
      {/* Emergency Actions Skeleton */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-5 w-5 text-muted" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
      </section>

      {/* Quick Actions Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <EnhancedCard key={i} variant="elevated" className="p-6 space-y-4">
              <Skeleton className="h-12 w-12 mx-auto rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </EnhancedCard>
          ))}
        </div>
      </section>
      
      {/* Dashboard Content Grid Skeleton */}
      <section className="grid lg:grid-cols-2 gap-8">
        <EnhancedCard variant="default" className="shadow-lg p-0">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </EnhancedCard>
        <EnhancedCard variant="default" className="shadow-lg p-0">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center">
              <Skeleton className="h-5 w-5 mr-3 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </CardTitle>
          </CardHeader>
          <div className="p-6 space-y-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </EnhancedCard>
      </section>
    </PageContainer>
  );
};
