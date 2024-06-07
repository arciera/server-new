import {Server} from "./Server.js";
import {PluginNotLoadedError} from "./error/PluginNotLoadedError.js";
import {Logger} from "./Logger.js";

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
     * Get this plugin's name
     */
    public name(): string {
        return this.constructor.name;
    }

    #server: Server | null = null;
    readonly #logger = new Logger("plugin/" + this.name());

    public getLogger(): Logger {
        return this.#logger;
    }

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
