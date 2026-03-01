import { Check, Clock, Package, Truck, MapPin, XCircle } from "lucide-react";

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const stepIndex = (status: string) => steps.findIndex((s) => s.key === status);

interface Props {
  status: string;
}

const OrderStatusTimeline = ({ status }: Props) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-3 px-1">
        <div className="w-8 h-8 rounded-full bg-destructive/15 flex items-center justify-center">
          <XCircle className="w-4 h-4 text-destructive" />
        </div>
        <span className="text-sm font-body font-medium text-destructive">Order Cancelled</span>
      </div>
    );
  }

  const current = stepIndex(status);

  return (
    <div className="py-3 px-1">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const done = i <= current;
          const active = i === current;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 transition-colors ${
                    i <= current ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                } ${active ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] font-body mt-1.5 text-center leading-tight ${
                  done ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
