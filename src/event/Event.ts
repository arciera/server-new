import {Server} from "../Server.js";

/**
 * An event
 */
export abstract class Event {
    /**
     * Create new event
     * @param server Server on which this event was fired
     */
    protected constructor(public readonly server: Server) {}

    #cancelled = false;
    public cancelled(): boolean {
        return this.#cancelled;
    }

    public setCancelled() {
        this.#cancelled = true;
    }
}
