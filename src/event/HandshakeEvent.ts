import {ConnectionEvent} from "./ConnectionEvent.js";
import {Connection} from "../Connection.js";

/**
 * The first packet sent by the client. This causes the server to switch into the target state.
 */
export class HandshakeEvent extends ConnectionEvent {
    /**
     * Create new connected event
     * @param connection The connection that was established
     * @param protocol Protocol version number
     * @param address Hostname or IP, e.g. localhost or 127.0.0.1, that was used to connect.
     * @param port Port on which the connection was established
     * @param nextState Target state
     */
    public constructor(
        connection: Connection,
        /**
         * Protocol version number
         */
        public readonly protocol: number,
        /**
         * Hostname or IP, e.g. localhost or 127.0.0.1, that was used to connect.
         */
        public readonly address: string,
        /**
         * Port on which the connection was established
         */
        public readonly port: number,
        /**
         * Target state
         */
        public readonly nextState: Connection.State
    ) {
        super(connection);
    }
}
