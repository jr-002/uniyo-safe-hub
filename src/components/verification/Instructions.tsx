
import { Info } from "lucide-react";

export const Instructions = () => (
  <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
      <Info className="h-5 w-5 text-primary" />
      What to do next:
    </h3>
    <ol className="text-sm text-muted-foreground space-y-2">
      <li className="flex items-start gap-2">
        <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
        <span>Check your email inbox (and the spam folder, just in case).</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
        <span>Click the "Verify Email" button within 24 hours.</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
        <span>You'll be automatically logged in to UniUyo Guardian.</span>
      </li>
    </ol>
  </div>
);
