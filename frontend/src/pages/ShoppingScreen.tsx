import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router-dom";

export function ShoppingScreen() {
  const { id } = useParams();

  console.log(`Pobieranie danych o ${id}`);

  return (
    <div className="shopping-lists-list h-full space-y-2 px-2 overflow-y-auto scrollbar-gutter-stable pt-[max(8px,env(safe-area-inset-top))]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="//shopping-lists">Lista</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>LIST NAME {id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
