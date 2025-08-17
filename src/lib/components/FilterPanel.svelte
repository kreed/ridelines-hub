<script lang="ts">
import type { FilterableActivityType } from "../types.js";

export let activityTypes: FilterableActivityType[] = [];
export let checkedTypes: string[] = [];

function toggleType(type: string): void {
	if (checkedTypes.includes(type)) {
		checkedTypes = checkedTypes.filter((t) => t !== type);
	} else {
		checkedTypes = [...checkedTypes, type];
	}
}
</script>

<nav class="filter-group">
    {#each activityTypes as activityType}
        <label class="filter-label" class:checked={checkedTypes.includes(activityType)}>
            <input
                type="checkbox"
                checked={checkedTypes.includes(activityType)}
                on:change={() => toggleType(activityType)}
            />
            {#if checkedTypes.includes(activityType)}✓{/if}
            {activityType}
        </label>
    {/each}
</nav>

<style>
    .filter-group {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        min-width: 120px;
        max-width: 200px;
    }
    
    @media (max-width: 480px) {
        .filter-group {
            min-width: 100px;
            max-width: 150px;
        }
    }
    
    .filter-label {
        display: block;
        padding: 10px 12px;
        background-color: #3386c0;
        color: white;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.4;
        text-transform: capitalize;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        transition: background-color 0.2s ease;
    }
    
    .filter-label:hover,
    .filter-label.checked {
        background-color: #4ea0da;
    }
    
    .filter-label:first-child {
        border-radius: 3px 3px 0 0;
    }
    
    .filter-label:last-child {
        border-radius: 0 0 3px 3px;
        border-bottom: none;
    }
    
    input {
        display: none;
    }
</style>