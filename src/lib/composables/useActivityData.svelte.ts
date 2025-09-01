import type { RootRouter } from "@kreed/ridelines-chainring";
import type { inferRouterOutputs } from "@trpc/server";
import { useClerkContext } from "svelte-clerk";
import { trpc } from "$lib/utils/trpc";

type RouterOutputs = inferRouterOutputs<RootRouter>;
type UserData = RouterOutputs["user"];

export function useActivityData() {
  const { user } = useClerkContext();
  const isSignedIn = $derived(!!user);

  let data = $state<UserData | null>(null);
  let isLoading = $state(false);

  $effect(() => {
    if (isSignedIn) {
      isLoading = true;
      trpc.user
        .query()
        .then((result) => {
          data = result;
          isLoading = false;
        })
        .catch(() => {
          isLoading = false;
        });
    }
  });

  const pmtilesUrl = $derived(data?.pmtiles_url || null);

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
