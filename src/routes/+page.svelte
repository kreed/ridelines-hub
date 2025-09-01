<script lang="ts">
import { SignedIn, SignedOut, useClerkContext } from "svelte-clerk";
import { goto } from "$app/navigation";

const clerkContext = useClerkContext();

function handleIntervalsSignup() {
  clerkContext.clerk?.client?.signUp.authenticateWithRedirect({
    strategy: "oauth_custom_intervals_icu",
    redirectUrl: `${window.location.origin}/map`,
    redirectUrlComplete: `${window.location.origin}/map`,
  });
}

function viewMap() {
  goto("/map");
}
</script>

<main class="landing-page">
	<div class="hero">
		<div class="hero-content">
			<h1>Ridelines</h1>
			<p class="subtitle">Visualize your intervals.icu activities on beautiful 3D maps</p>

			<div class="features">
				<div class="feature">
					<h3>🗺️ 3D Terrain Maps</h3>
					<p>See your rides, runs, and hikes overlaid on stunning 3D terrain</p>
				</div>
				<div class="feature">
					<h3>🔗 intervals.icu Integration</h3>
					<p>Automatically sync your activities from intervals.icu</p>
				</div>
				<div class="feature">
					<h3>🎨 Multiple Map Styles</h3>
					<p>Choose from outdoor, satellite, and dark themes</p>
				</div>
			</div>

			<SignedIn>
				<button class="login-button primary" onclick={viewMap}>
					View Map
				</button>
			</SignedIn>

			<SignedOut>
				<button
					class="login-button primary"
					onclick={handleIntervalsSignup}
				>
					Connect with Intervals.icu
				</button>
			</SignedOut>
		</div>
	</div>
</main>

<svelte:head>
    <title>Ridelines - intervals.icu activity mapper</title>
    <meta name="description" content="Visualize your intervals.icu activities on beautiful 3D terrain maps">
</svelte:head>

<style>
	.landing-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 2rem;
	}

	.hero {
		text-align: center;
		max-width: 800px;
		color: white;
	}

	.hero-content h1 {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.subtitle {
		font-size: 1.25rem;
		margin-bottom: 3rem;
		opacity: 0.9;
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.feature {
		background: rgba(255, 255, 255, 0.1);
		padding: 1.5rem;
		border-radius: 8px;
		backdrop-filter: blur(10px);
	}

	.feature h3 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.feature p {
		font-size: 0.9rem;
		opacity: 0.9;
		line-height: 1.4;
	}

	.login-button {
		background: #ff6b6b;
		color: white;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
	}

	.login-button:hover {
		background: #ff5252;
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
	}

	@media (max-width: 768px) {
		.hero-content h1 {
			font-size: 2.5rem;
		}

		.features {
			grid-template-columns: 1fr;
		}

		.login-button {
			width: 100%;
		}
	}
</style>
