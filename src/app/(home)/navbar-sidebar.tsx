import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

interface NavbarSidebarProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavbarSidebar({
  items,
  open,
  onOpenChange,
}: NavbarSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 transition-none" side="left">
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              href={item.href}
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className="border-t">
            <Link
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              href="/sign-in"
              onClick={() => onOpenChange(false)}
            >
              Log in
            </Link>
            <Link
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              href="/sign-up"
              onClick={() => onOpenChange(false)}
            >
              Start selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
