// import { useNavigate } from "react-router-dom";
// ICONS
import { Plus, Search } from "lucide-react";
// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
// COMPONENTS
import { ListAddOverlay } from "../overlay/lists/ListAddOverlay";

type RecipesListsNavbarProps = {
  inputVal: string;
  setInputVal: (val: string) => void;
};

export function RecipesListNavbar({ inputVal, setInputVal }: RecipesListsNavbarProps) {
  // const navigate = useNavigate();

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
        </ButtonGroup>
        <div className="flex gap-2">
          <ListAddOverlay>
            <Button variant="default" onClick={(e) => e.currentTarget.blur()}>
              Stwórz <Plus className="size-4" />
            </Button>
          </ListAddOverlay>
        </div>
      </ButtonGroup>
    </div>
  );
}
