declare module 'mapbox-pmtiles' {
    export interface PMTilesHeader {
        minLon: number;
        minLat: number;
        maxLon: number;
        maxLat: number;
        minZoom: number;
        maxZoom: number;
    }

    export interface PmTilesOptions {
        url: string;
        minzoom?: number;
        maxzoom?: number;
        bounds?: [number, number, number, number];
    }

    export class PmTilesSource {
        static getHeader(url: string): Promise<PMTilesHeader>;
        
        constructor(id: string, options: PmTilesOptions, dispatcher?: unknown, eventedParent?: unknown);
        
        // Source implementation
        type: string;
        id: string;
        minzoom: number;
        maxzoom: number;
        tileSize: number;
        attribution?: string;
        
        onAdd(map: unknown): void;
        onRemove(map: unknown): void;
        serialize(): unknown;
        hasTransition(): boolean;
        loaded(): boolean;
        loadTile(tile: unknown, callback: unknown): void;
        abortTile(tile: unknown, callback: unknown): void;
        unloadTile(tile: unknown, callback: unknown): void;
    }

    export const SOURCE_TYPE: string;
}