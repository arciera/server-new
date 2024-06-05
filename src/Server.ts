import net from "node:net";
import {ConnectedEvent} from "./event/ConnectedEvent";
import {Event} from "./event/Event";
import {Connection} from "./Connection";
import {ServerListeningEvent} from "./event/ServerListeningEvent";
import {Listener} from "./Listener";
import {PluginManager} from "./PluginManager";

/**
 * Arciera server
 */
export class Server {
    /**
     * Create new server
     * @param port port on which the server is listening for connections
     */
    public constructor(
        /**
         * Port on which the server is listening for connections
         */
        public readonly port: number
    ) {}

    /**
     * This server's plugin manager
     */
    public plugins = new PluginManager(this);

    private listeners: Map<string, Listener<any>[]> = new Map();

    /**
     * Register an event listener
     * @param event The event constructor class
     * @param listener
     */
    public on<T extends Event>(event: new (...args: any[]) => T, listener: Listener<T>): void {
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
    public emit<T extends Event>(event: T): void {
        const listeners = this.listeners.get(event.constructor.name) ?? [];
        for (const listener of listeners) {
            if (event.cancelled()) break;
            listener._run(event);
        }
    }

    /**
     * Opens the server for connections
     */
    public async listen() {
        await new Promise(resolve => {
            this.tcpServer.once("listening", resolve);
            this.tcpServer.listen(this.port);
        });
        this.emit(new ServerListeningEvent(this));
    }

    private tcpServer: net.Server = new net.Server(this.connectionListener.bind(this));

    private connectionListener (socket: net.Socket) {
        this.emit(new ConnectedEvent(new Connection(this, socket)));
    }
}
