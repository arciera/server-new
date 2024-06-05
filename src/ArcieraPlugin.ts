import {Server} from "./Server";
import {PluginNotLoadedError} from "./error/PluginNotLoadedError";

/**
 * An arciera plugin
 */
export abstract class ArcieraPlugin {

    /**
     * Get this plugin's ID
     */
    public id(): string {
        return this.constructor.name.toLowerCase();
    }


    /**
     * Get this plugin's ID
     */
    public static id(): string {
        return this.name.toLowerCase();
    }

    #server: Server | null = null;

    /**
     * @internal
     */
    public _load(server: Server) {
        this.#server = server;
        this.onLoad();
    }

    /**
     * @internal
     */
    public _unload() {
        this.#server = null;
        this.onUnload();
    }

    /**
     * Check if this plugin has been loaded
     */
    public loaded() {
        return this.#server !== null;
    }

    /**
     * Get Arciera server instance
     */
    public server(): Server {
        if (!this.loaded())
            throw new PluginNotLoadedError(this);
        return this.#server!;
    }

    /**
     * Called when the plugin is loaded
     */
    public abstract onLoad(): void;

    /**
     * Called when the plugin is unloaded
     */
    public abstract onUnload(): void;
}
