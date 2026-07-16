import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";
import { ListAddOverlay } from "../ListAddOverlay";
import { Package, Plus, Search } from "lucide-react";

type ShoppingListsNavbarProps = {
  inputVal: string;
  setInputVal: (val: string) => void;
};

export function ShoppingListsNavbar({ inputVal, setInputVal }: ShoppingListsNavbarProps) {
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
          <Button variant="secondary" onClick={(e) => e.currentTarget.blur()}>
            Razem <Package className="size-4" />
          </Button>
          <ListAddOverlay>
            <Button variant="default" onClick={(e) => e.currentTarget.blur()}>
              Dodaj <Plus className="size-4" />
            </Button>
          </ListAddOverlay>
        </div>
      </ButtonGroup>
    </div>
  );
}
