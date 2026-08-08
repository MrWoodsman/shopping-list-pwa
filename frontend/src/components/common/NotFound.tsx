import { SearchX } from "lucide-react";

interface NotFoundProps {
  title?: string;
  description?: string;
}

export function NotFound({ title, description }: NotFoundProps) {
  return (
    <div className="w-full h-full px-4 flex flex-col gap-3 items-center justify-center">
      <SearchX className="w-12 h-12 text-muted-foreground" />
      <div className="flex flex-col gap-1 items-center max-w-xs">
        <h1 className="text-center text-base font-medium text-balance text-foreground">{title}</h1>
        <p className="text-center text-xs text-balance text-foreground/50">{description}</p>
      </div>
    </div>
  );
}
