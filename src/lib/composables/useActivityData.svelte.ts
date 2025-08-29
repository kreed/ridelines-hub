import { useClerkContext } from "svelte-clerk";
import { ridelinesService } from "$lib/services/ridelines.js";

export function useActivityData() {
	let pmtilesUrl = $state<string | null>(null);
	let isLoading = $state(false);

	const { user } = useClerkContext();
	const isSignedIn = $derived(!!user);

	$effect(() => {
		if (!isSignedIn) {
			pmtilesUrl = null;
			return;
		}

		isLoading = true;
		ridelinesService
			.getUser()
			.then((data) => {
				pmtilesUrl = data?.pmtiles_url || null;
			})
			.catch(() => {
				pmtilesUrl = null;
			})
			.finally(() => {
				isLoading = false;
			});
	});

	return {
		get pmtilesUrl() {
			return pmtilesUrl;
		},
		get isDataReady() {
			return !!pmtilesUrl && !isLoading;
		},
		get isLoading() {
			return isLoading;
		},
		getVectorSource: () =>
			pmtilesUrl
				? {
						type: "vector" as const,
						url: `pmtiles://${pmtilesUrl}`,
					}
				: null,
	};
}
