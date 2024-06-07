import {ConnectionEvent} from "./ConnectionEvent.js";
import {Connection} from "../Connection.js";

/**
 * An event that is fired when a new TCP connection is established
 */
export class ConnectedEvent extends ConnectionEvent {
    /**
     * Create new connected event
     * @param connection The connection that was established
     */
    public constructor(connection: Connection) {
        super(connection);
    }
}
