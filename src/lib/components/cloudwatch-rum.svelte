<script lang="ts">
import { AwsRum } from "aws-rum-web";
import { onMount } from "svelte";
import { env } from "$env/dynamic/public";

onMount(() => {
  try {
    const config = {
      sessionSampleRate: 1.0,
      telemetries: ["errors", "performance", "http"],
      allowCookies: true,
      disableAutoPageView: false,
      enableXRay: false,
      signing: false,
      logLevel: "ERROR",
    };

    const awsRum = new AwsRum(env.PUBLIC_RUM_APP_ID, "1.0.0", "us-west-2", config);

    awsRum.enable();
  } catch (error) {
    console.error("Failed to initialize CloudWatch RUM:", error);
  }
});
</script>
