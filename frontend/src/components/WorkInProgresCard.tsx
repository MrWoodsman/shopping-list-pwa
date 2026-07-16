import { Hammer } from "lucide-react";

export const WorkInProgresCard = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <Hammer className="size-16" />
      <h2 className="text-lg font-semibold">W Trakcie budowy</h2>
    </div>
  );
};
