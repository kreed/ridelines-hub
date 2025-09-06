<script lang="ts">
import { Map as MapIcon, Navigation, RefreshCw, Zap } from "@lucide/svelte";
import { SignedIn, SignedOut, useClerkContext } from "svelte-clerk";
import { goto } from "$app/navigation";
import { Button } from "$lib/components/ui/button";
import * as Card from "$lib/components/ui/card";

const clerkContext = useClerkContext();

function handleIntervalsSignup() {
  clerkContext.clerk?.client?.signUp.authenticateWithRedirect({
    strategy: "oauth_custom_intervals_icu",
    redirectUrl: `${window.location.origin}/oauth/callback`,
    redirectUrlComplete: `${window.location.origin}/map`,
  });
}

function viewMap() {
  goto("/map");
}
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-8">
	<div class="text-center max-w-4xl text-white">
		<div class="space-y-8">
			<h1 class="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">ridelines.xyz</h1>
			<p class="text-xl md:text-2xl opacity-90">Visualize all your intervals.icu activities on one map</p>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-12 max-w-2xl mx-auto">
				<Card.Root class="bg-white/10 backdrop-blur-md border-white/20">
					<Card.Header>
						<Card.Title class="text-white text-lg flex items-center justify-center gap-2">
							<Zap class="h-5 w-5" />
							Lightning fast vector tiles
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-white/90 text-sm text-left">Pre-generated vector map tiles for instant loading and smooth interactions</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="bg-white/10 backdrop-blur-md border-white/20">
					<Card.Header>
						<Card.Title class="text-white text-lg flex items-center justify-center gap-2">
							<MapIcon class="h-5 w-5" />
							Explore all your journeys
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-white/90 text-sm text-left">Navigate through your complete activity history on a single interactive map</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="bg-white/10 backdrop-blur-md border-white/20">
					<Card.Header>
						<Card.Title class="text-white text-lg flex items-center justify-center gap-2">
							<Navigation class="h-5 w-5" />
							All GPS activities
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-white/90 text-sm text-left">Rides, runs, hikes, ski tours, swims, and more - if it has GPS, we display it</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="bg-white/10 backdrop-blur-md border-white/20">
					<Card.Header>
						<Card.Title class="text-white text-lg flex items-center justify-center gap-2">
							<RefreshCw class="h-5 w-5" />
							Quick intervals.icu import
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-white/90 text-sm text-left">One-click authorization and your activities start syncing immediately</p>
					</Card.Content>
				</Card.Root>
			</div>

			<SignedIn>
				<Button size="lg" onclick={viewMap} class="text-lg px-8 py-6">
					View Map
				</Button>
			</SignedIn>

			<SignedOut>
				<Button size="lg" onclick={handleIntervalsSignup} class="text-lg px-8 py-6">
					Connect with Intervals.icu
				</Button>
			</SignedOut>
		</div>
	</div>
</main>

<svelte:head>
    <title>ridelines.xyz - intervals.icu activity mapper</title>
    <meta name="description" content="Visualize your intervals.icu activities on beautiful 3D terrain maps">
</svelte:head>
