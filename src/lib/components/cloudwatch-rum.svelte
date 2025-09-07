<script lang="ts">
import { AwsRum } from "aws-rum-web";
import { onMount } from "svelte";
import { page } from "$app/state";
import { PUBLIC_RUM_APP_ID } from "$env/static/public";

// RUM endpoint - proxied through CloudFront
const RUM_ENDPOINT = `${page.url.origin}/rum`;

onMount(() => {
  try {
    const config = {
      sessionSampleRate: 1.0,
      endpoint: RUM_ENDPOINT,
      telemetries: ["errors", "performance", "http"],
      allowCookies: false, // GDPR compliance
      disableAutoPageView: false,
      enableXRay: false,
      logLevel: "ERROR",
    };

    const awsRum = new AwsRum(PUBLIC_RUM_APP_ID, "1.0.0", "us-west-2", config);

    awsRum.enable();
  } catch (error) {
    console.error("Failed to initialize CloudWatch RUM:", error);
  }
});
</script>
