import { useNavigate } from "react-router-dom";
// ICONS
import { Pencil, Search, Funnel } from "lucide-react";
// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
// COMPONENTS
import { RecipeAddOverlay } from "../overlay/recipes/RecipeAddOverlay";
import { ROUTES } from "@/config/routes";

type RecipesListsNavbarProps = {
  inputVal: string;
  setInputVal: (val: string) => void;
};

export function RecipesListNavbar({ inputVal, setInputVal }: RecipesListsNavbarProps) {
  const navigate = useNavigate();

  return (
    <div className="search-container flex gap-2 px-2 pt-[max(8px,env(safe-area-inset-top))]">
      <ButtonGroup aria-label="Button group" className="w-full">
        <ButtonGroup className="w-full">
          <Button variant={"outline"} size={"icon"}>
            <Search className="size-4" />{" "}
          </Button>
          <Input
            type="text"
            value={inputVal}
            onInput={(e) => setInputVal(e.currentTarget.value)}
            placeholder="Szukaj"
          />
          <Button variant={"outline"} size={"icon"}>
            <Funnel className="size-4" />{" "}
          </Button>
        </ButtonGroup>
        <div className="flex gap-2">
          <RecipeAddOverlay
            onAddNew={() => console.log("Otwieram formularz nowego przepisu...")}
            onOpenDrafts={() => navigate(ROUTES.RECIPES_DRAFTS)}
          >
            <Button variant="default" size={"icon"} onClick={(e) => e.currentTarget.blur()}>
              <Pencil className="size-4" />
            </Button>
          </RecipeAddOverlay>
        </div>
      </ButtonGroup>
    </div>
  );
}
