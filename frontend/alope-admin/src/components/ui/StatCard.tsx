import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string; 
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
        )}
      </div>
      {trend && (
        <div className="mt-4 text-sm text-green-600 font-medium">
          {trend} dari bulan lalu
        </div>
      )}
    </div>
  );
}
