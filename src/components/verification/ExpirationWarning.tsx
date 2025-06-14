
import { AlertTriangle } from "lucide-react";

export const ExpirationWarning = () => (
  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
          Link Expires in 24 Hours
        </h3>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Your verification link is time-sensitive. If it expires, you can request a new one below.
        </p>
      </div>
    </div>
  </div>
);
