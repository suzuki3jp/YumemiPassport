import { TriangleAlert } from "lucide-react";
import { ReloadButton } from "./reload-button";

interface ErrorCardProps {
  title: string;
  description: string;
}

export function ErrorCard({ title, description }: ErrorCardProps) {
  return (
    <div className="mb-6 rounded-lg border-2 border-red-300 bg-white p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <TriangleAlert className="h-6 w-6 text-red-500" />
        <div className="flex-1">
          <h3 className="mb-1 font-medium text-red-800 text-sm">{title}</h3>
          <p className="text-red-700 text-sm">{description}</p>
          <ReloadButton />
        </div>
      </div>
    </div>
  );
}
