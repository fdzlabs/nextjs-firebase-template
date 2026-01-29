import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubscriptionLoading() {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-8 px-4 py-10">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={`subscription-skeleton-${index}`}
            className="overflow-hidden"
          >
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
