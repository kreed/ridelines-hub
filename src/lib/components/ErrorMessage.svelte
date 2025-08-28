<script lang="ts">
export let show: boolean = false;
export let message: string = "";
</script>

{#if show}
    <div class="error-message">
        {message}
    </div>
{/if}

<style>
    .error-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 5px;
        z-index: 2000;
        font-family: 'Helvetica Neue', Arial, sans-serif;
    }
</style>
