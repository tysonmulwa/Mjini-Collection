import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-foreground font-display font-bold text-3xl">?</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Page Not Found</h1>
        <p className="text-muted-foreground font-body mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button className="gradient-brand text-primary-foreground rounded-xl font-body font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
