import {ConnectionEvent} from "./ConnectionEvent";
import {Connection} from "../Connection";

/**
 * The TCP connection has ended
 */
export class ConnectionEndEvent extends ConnectionEvent {
    /**
     * Create new connection end event
     * @param connection The connection that was disconnected
     */
    public constructor(connection: Connection) {
        super(connection);
    }
}
