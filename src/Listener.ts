import {Event} from "./event/Event.js";

/**
 * An event listener
 */
export class Listener<T extends Event> {
    /**
     * The name of the event class constructor
     */
    public readonly event: string;

    /**
     * The function that will be called when the event is fired
     * @internal
     */
    public readonly _run: (event: T) => void | Promise<void>;

    /**
     * Create new event listener
     * @param event The event class constructor
     * @param run The function that will be called when the event is fired
     * @param priority The priority of the listener. The higher the priority, the earlier the listener will be called.
     */
    public constructor(
        event: new (...args: any[]) => T,
        run: (event: T) => void | Promise<void>,
        /**
         * The priority of the listener. The higher the priority, the earlier the listener will be called.
         */
        public readonly priority = 0
    ) {
        this.event = event.name;
        this._run = run.bind(this);
    }
}
