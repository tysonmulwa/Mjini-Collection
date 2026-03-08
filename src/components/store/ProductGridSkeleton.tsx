import { Skeleton } from "@/components/ui/skeleton";

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="border border-border/50">
        <Skeleton className="aspect-[3/4] w-full rounded-none" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-3 w-16 rounded-none" />
          <Skeleton className="h-4 w-3/4 rounded-none" />
          <Skeleton className="h-3 w-20 rounded-none" />
          <Skeleton className="h-5 w-24 rounded-none" />
        </div>
      </div>
    ))}
  </div>
);

export default ProductGridSkeleton;
