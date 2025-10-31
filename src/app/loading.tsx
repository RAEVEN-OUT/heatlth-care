import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3 p-6 bg-card rounded-lg space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-4 p-6 bg-card rounded-lg">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))}
            </div>
            <div className="lg:col-span-1 space-y-6">
                 {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-4 p-6 bg-card rounded-lg h-40">
                         <Skeleton className="h-6 w-1/2" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
