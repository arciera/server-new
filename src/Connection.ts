import net from "node:net";
import {Server} from "./Server";

/**
 * A TCP socket connection on the server
 */
export class Connection {
    /**
     * The client protocol version
     */
    public protocol: number | null = null;

    /**
     * The connection state
     */
    public state: Connection.State | null = null;

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
    ) {};
}

export namespace Connection {
    export enum State {
        STATUS,
        LOGIN,
        CONFIGURATION,
        PLAY
    }
}
