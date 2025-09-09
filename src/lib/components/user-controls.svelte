<script lang="ts">
import { LogOut, RefreshCw, Settings, User } from "@lucide/svelte";
import { ClerkLoading, SignedIn, SignedOut, useClerkContext } from "svelte-clerk";
import { goto } from "$app/navigation";
import * as Avatar from "./ui/avatar";
import { Button } from "./ui/button";
import * as DropdownMenu from "./ui/dropdown-menu";
import { LightSwitch } from "./ui/light-switch";

let {
  variant = "default",
}: {
  variant?: "default" | "glass";
} = $props();

const clerkContext = useClerkContext();
</script>

<div class="flex items-center gap-2">
  <LightSwitch variant={variant === "glass" ? "glass" : "ghost"} />

  {#if clerkContext.auth.userId}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="inline-flex h-8 w-8 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Avatar.Root class="h-8 w-8">
          <Avatar.Image src={clerkContext.user?.imageUrl} alt="User avatar" />
          <Avatar.Fallback>{clerkContext.user?.firstName?.[0] || clerkContext.user?.username?.[0] || 'U'}</Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56" align="end">
        <DropdownMenu.Item onSelect={() => goto("/sync-history")}>
          <RefreshCw class="mr-2 h-4 w-4" />
          Sync History
        </DropdownMenu.Item>
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
  {:else}
    <Button variant="ghost" size="sm" onclick={() => clerkContext.clerk?.openSignIn()}>
      Sign In
    </Button>
  {/if}
</div>
