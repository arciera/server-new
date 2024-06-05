import {ArcieraPlugin} from "../ArcieraPlugin";

/**
 * Plugin is not loaded
 */
export class PluginNotLoadedError extends Error {
    /**
     * Create new plugin not loaded error
     * @param plugin
     */
    public constructor(plugin: ArcieraPlugin) {
        super(plugin.id() + ": is not loaded");
    }
}
