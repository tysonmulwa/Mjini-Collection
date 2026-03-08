import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => (
  <section className="py-16 md:py-20 border-b border-border/30">
    <div className="container mx-auto px-4 text-center space-y-6">
      <Skeleton className="h-10 md:h-12 w-72 mx-auto rounded-none" />
      <div className="flex justify-center gap-3">
        <Skeleton className="h-10 w-32 rounded-none" />
        <Skeleton className="h-10 w-36 rounded-none" />
      </div>
    </div>
  </section>
);

export default HeroSkeleton;
