import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";

type ShoppingListsNavbarProps = {
  inputVal: string;
  setInputVal: (val: string) => void;
};

export function ShoppingListsNavbar({ inputVal, setInputVal }: ShoppingListsNavbarProps) {
  return (
    <div className="search-container flex gap-2 px-2 pt-[max(8px,env(safe-area-inset-top))]">
      <ButtonGroup aria-label="Button group" className="w-full">
        <ButtonGroup>
          <Button variant={"outline"}>+</Button>
        </ButtonGroup>
        <ButtonGroup className="w-full">
          <Input
            type="text"
            value={inputVal}
            onInput={(e) => setInputVal(e.currentTarget.value)}
            placeholder="Wyszukaj liste"
          />
          <Button variant={"outline"}>Szukaj</Button>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}
