import net from "node:net";
import {Server} from "./Server";
import {EventEmitter} from "./EventEmitter";
import {Event} from "./event/Event";

/**
 * A TCP socket connection on the server
 */
export class Connection extends EventEmitter {
    /**
     * The client protocol version
     */
    public protocol: number | null = null;

    /**
     * The connection state
     */
    public state: Connection.State | null = null;

    readonly #id: `${string}:${number}` | null = null;

    /**
     * Create a new connection instance
     * @param server The server
     * @param socket The connection socket
     */
    public constructor(
        /**
         * The server
         */
        public readonly server: Server,
        /**
         * The connection socket
         */
        public readonly socket: net.Socket
    ) {
        super();
        const remoteAddress = this.socket.remoteAddress;
        const remotePort = this.socket.remotePort;
        this.#id = remoteAddress === undefined || remotePort === undefined ? null : `${remoteAddress}:${remotePort}`;
    };

    /**
     * Broadcast an event to all subscribed listeners on:
     *
     * 1. this connection
     * 2. this connection's server
     *
     * (in that order)
     * @param event
     */
    public override emit<T extends Event>(event: T): void {
        super.emit(event);
        this.server.emit(event);
    }

    /**
     * Connections are identified by their source address and port
     *
     * @return `null` if the connection was not properly established, otherwise "ip:port"
     */
    public get id(): `${string}:${number}` | null {
        return this.#id;
    }
}

export namespace Connection {
    export enum State {
        STATUS,
        LOGIN,
        CONFIGURATION,
        PLAY
    }
}
