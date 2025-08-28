<script lang="ts">
import type { FilterableActivityType, MapStyle } from "../types.js";

export let activityTypes: FilterableActivityType[] = [];
export let checkedTypes: string[] = [];
export let mapStyles: MapStyle[] = [];
export let currentStyle: string = "";
export let onStyleChange: (styleUrl: string) => void;

function toggleType(type: string): void {
	if (checkedTypes.includes(type)) {
		checkedTypes = checkedTypes.filter((t) => t !== type);
	} else {
		checkedTypes = [...checkedTypes, type];
	}
}

// Style selector state
let isStyleSelectorOpen = false;

function toggleStyleSelector() {
	isStyleSelectorOpen = !isStyleSelectorOpen;
}

function selectStyle(styleUrl: string) {
	onStyleChange(styleUrl);
	isStyleSelectorOpen = false;
}

$: currentStyleData =
	mapStyles.find((style) => style.url === currentStyle) || mapStyles[0];
</script>

<nav class="control-panel">
    <!-- Style Selector Section -->
    <div class="style-section">
        <button class="style-button" on:click={toggleStyleSelector} aria-expanded={isStyleSelectorOpen}>
            <span class="style-name">{currentStyleData?.name || 'Style'}</span>
            <svg class="chevron" class:rotated={isStyleSelectorOpen} viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        {#if isStyleSelectorOpen}
            <div class="style-dropdown">
                {#each mapStyles as style}
                    <button
                        class="style-option"
                        class:selected={style.url === currentStyle}
                        on:click={() => selectStyle(style.url)}
                    >
                        <span class="style-name">{style.name}</span>
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Activity Filter Section -->
    <div class="filter-section">
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
    </div>
</nav>

<style>
    .control-panel {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 9999;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        min-width: 160px;
        max-width: 220px;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        pointer-events: auto;
    }

    @media (max-width: 480px) {
        .control-panel {
            min-width: 140px;
            max-width: 180px;
        }
    }

    /* Style Selector Section */
    .style-section {
        position: relative;
    }

    .style-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        border: none;
        padding: 10px 12px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        transition: background-color 0.2s ease;
        pointer-events: auto;
    }

    .style-button:hover {
        background: rgba(255, 255, 255, 1);
    }

    .style-name {
        text-align: left;
    }

    .chevron {
        width: 12px;
        height: 8px;
        transition: transform 0.2s ease;
        color: #666;
    }

    .chevron.rotated {
        transform: rotate(180deg);
    }

    .style-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
    }

    .style-option {
        display: block;
        width: 100%;
        padding: 8px 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 12px;
        font-weight: 500;
        color: #333;
        text-align: left;
    }

    .style-option:hover {
        background: rgba(51, 134, 192, 0.1);
    }

    .style-option.selected {
        background: rgba(51, 134, 192, 0.15);
        color: #3386c0;
    }

    /* Activity Filter Section */
    .filter-section {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
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
        pointer-events: auto;
        user-select: none;
    }

    .filter-label:hover,
    .filter-label.checked {
        background-color: #4ea0da;
    }

    .filter-label:last-child {
        border-bottom: none;
        border-radius: 0 0 6px 6px;
    }

    input {
        display: none;
    }
</style>
