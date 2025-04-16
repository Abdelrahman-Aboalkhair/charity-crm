import { cn } from "@/app/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  percentage: number;
  caption?: string;
  icon?: React.ReactNode;
};

const StatsCard = ({
  title,
  value,
  percentage,
  caption,
  icon,
}: StatsCardProps) => {
  const isPositive = percentage >= 0;

  return (
    <div className="text-black p-6 rounded-xl shadow-sm w-full flex flex-col gap-2 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        {icon && (
          <div className="text-indigo-600 bg-indigo-100 rounded-full p-2">
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-bold">{value}</div>

      <div className="flex items-center gap-1 text-sm">
        <span
          className={cn(
            "flex items-center font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {Math.abs(percentage)}%
        </span>
        {caption && <span className="text-gray-800">· {caption}</span>}
      </div>
    </div>
  );
};

export default StatsCard;
