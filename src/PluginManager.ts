import {Server} from "./Server.js";
import {ArcieraPlugin} from "./ArcieraPlugin.js";

/**
 * Arciera plugin manager
 */
export class PluginManager {
    /**
     * @internal
     */
    public constructor(
        private readonly server: Server
    ) {}

    #plugins: Map<string, ArcieraPlugin> = new Map();

    /**
     * List of the loaded plugins
     */
    public array(): readonly ArcieraPlugin[] {
        return Object.freeze(Array.from(this.#plugins.values()));
    }

    /**
     * ID to plugin instance map of the loaded plugins
     */
    public map(): ReadonlyMap<string, ArcieraPlugin> {
        return Object.freeze(this.#plugins);
    }

    /**
     * Get a loaded plugin
     * @param id Plugin ID
     */
    public get(id: string): ArcieraPlugin | null;
    /**
     * Get a loaded plugin
     * @param clazz Plugin class constructor
     */
    public get(clazz: new (...args: any[]) => ArcieraPlugin): ArcieraPlugin | null;
    /**
     * Get a loaded plugin
     * @param plugin An instance of the plugin
     */
    public get(plugin: ArcieraPlugin): ArcieraPlugin | null;
    /** @internal **/
    public get(plugin: string | (new (...args: any[]) => ArcieraPlugin) | ArcieraPlugin): ArcieraPlugin | null {
        const id = typeof plugin === "string" ? plugin : (plugin as {id(): string}).id();
        return this.#plugins.get(id) ?? null;
    }

    /**
     * Load a plugin
     * @param plugin
     */
    public load(plugin: ArcieraPlugin) {
        plugin.getLogger().info("Loading plugin " + plugin.name());
        this.#plugins.set(plugin.id(),plugin);
        plugin._load(this.server);
    }

    /**
     * Unload a plugin
     * @param plugin
     */
    public unload(plugin: ArcieraPlugin) {
        plugin.getLogger().info("Unloading plugin " + plugin.name());
        plugin._unload();
        this.#plugins.delete(plugin.id());
    }
}
