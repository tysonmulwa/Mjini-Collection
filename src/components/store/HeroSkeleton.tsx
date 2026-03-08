import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => (
  <section className="py-10 md:py-20 border-b border-border/30">
    <div className="container mx-auto px-4 text-center space-y-4 md:space-y-6">
      <Skeleton className="h-8 md:h-12 w-64 md:w-72 mx-auto rounded-none" />
      <Skeleton className="h-4 w-48 mx-auto rounded-none" />
      <div className="flex justify-center gap-3 pt-2">
        <Skeleton className="h-11 w-28 md:w-32 rounded-none" />
        <Skeleton className="h-11 w-32 md:w-36 rounded-none" />
      </div>
    </div>
  </section>
);

export default HeroSkeleton;
