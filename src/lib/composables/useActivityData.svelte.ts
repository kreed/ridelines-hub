import { authStore } from "$lib/stores/auth.svelte.js";

export function useActivityData() {
	let pmtilesUrl = $state<string | null>(null);
	let isDataReady = $state(false);

	// Reactive data loading based on auth state
	$effect(() => {
		if (authStore.pmtilesUrl && !authStore.isLoading) {
			pmtilesUrl = authStore.pmtilesUrl;
			isDataReady = true;
		} else {
			pmtilesUrl = null;
			isDataReady = false;
		}
	});

	const getVectorSource = () => {
		if (!pmtilesUrl) return null;

		return {
			type: "vector" as const,
			url: `pmtiles://${pmtilesUrl}`,
		};
	};

	return {
		get pmtilesUrl() {
			return pmtilesUrl;
		},
		get isDataReady() {
			return isDataReady;
		},
		getVectorSource,
	};
}
