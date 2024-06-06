import {Listener} from "./Listener";
import {Event} from "./event/Event";

export abstract class EventEmitter<E extends Event = Event> {
    private listeners: Map<string, Listener<any>[]> = new Map();

    /**
     * Register an event listener
     * @param event The event constructor class
     * @param listener
     */
    public on<T extends E>(event: new (...args: any[]) => T, listener: Listener<T>): void {
        if (!this.listeners.has(event.name))
            this.listeners.set(event.name, []);
        const listeners = this.listeners.get(event.name)!;
        let insertIndex = listeners.findIndex(l => l.priority >= listener.priority);
        if (insertIndex === -1) {
            listeners.push(listener);
            return
        }
        while (insertIndex < listeners.length && listeners[insertIndex]!.priority >= listener.priority)
            ++insertIndex;
        listeners.splice(insertIndex, 0, listener);
    }

    /**
     * Broadcast an event to all subscribed listeners
     * @param event
     */
    public emit<T extends E>(event: T): void {
        const listeners = this.listeners.get(event.constructor.name) ?? [];
        for (const listener of listeners) {
            if (event.cancelled()) break;
            listener._run(event);
        }
    }

    /**
     * Remove all event listeners
     */
    public removeListeners(): void;

    /**
     * Remove an event listener
     * @param event The event constructor class
     */
    public removeListeners(event: new (...args: any[]) => E): void;

    /** @internal **/
    public removeListeners(event?: new (...args: any[]) => E): void {
        if (event === undefined)
            this.listeners.clear();
        else
            this.listeners.delete(event.name);
    }
}
