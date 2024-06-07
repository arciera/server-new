import {ConnectionEvent} from "./ConnectionEvent.js";
import {Connection} from "../Connection.js";

/**
 * Fired for any data that comes from the connection
 */
export class IncomingDataEvent extends ConnectionEvent {
    /**
     * Create new incoming data event
     * @param connection The connection that sent the data
     * @param data The data that was sent. This may not be an entire packet.
     */
    public constructor(
        connection: Connection,
        /**
         * The data that was sent. This may not be an entire packet.
         */
        public readonly data: Buffer
    ) {
        super(connection);
    }
}
