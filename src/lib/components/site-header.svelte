<script lang="ts">
import { LogOut, Settings } from "@lucide/svelte";
import { SignedIn, SignedOut, useClerkContext } from "svelte-clerk";
import { goto } from "$app/navigation";
import * as Avatar from "./ui/avatar";
import { Button } from "./ui/button";
import * as DropdownMenu from "./ui/dropdown-menu";
import { LightSwitch } from "./ui/light-switch";

const clerkContext = useClerkContext();
</script>

<header class="bg-background sticky top-0 z-50 flex w-full items-center border-b">
  <div class="h-(--header-height) flex w-full items-center justify-between px-4">
    <!-- Left side: Navigation links -->
    <nav class="flex items-center gap-6">
      <a href="/" class="text-sm font-medium transition-colors hover:text-primary">
        Home
      </a>
      <a href="/map" class="text-sm font-medium transition-colors hover:text-primary">
        Map
      </a>
    </nav>

    <!-- Right side: Light switch and user menu -->
    <div class="flex items-center gap-2">
      <LightSwitch variant="ghost" />

      <SignedIn>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <Avatar.Root class="h-8 w-8">
              <Avatar.Image src={clerkContext.user?.imageUrl} alt="User avatar" />
              <Avatar.Fallback>{clerkContext.user?.firstName?.[0] || clerkContext.user?.username?.[0] || 'U'}</Avatar.Fallback>
            </Avatar.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56" align="end">
            <DropdownMenu.Item onSelect={() => clerkContext.clerk?.openUserProfile()}>
              <Settings class="mr-2 h-4 w-4" />
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={() => clerkContext.clerk?.signOut()}>
              <LogOut class="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </SignedIn>

      <SignedOut>
        <Button variant="ghost" size="sm" onclick={() => clerkContext.clerk?.openSignIn()}>
          Sign In
        </Button>
      </SignedOut>
    </div>
  </div>
</header>
