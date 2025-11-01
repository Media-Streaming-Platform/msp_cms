import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/UserNav";

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
