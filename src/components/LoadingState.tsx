
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Processing video..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
