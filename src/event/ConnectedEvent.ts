import {ConnectionEvent} from "./ConnectionEvent";
import {Connection} from "../Connection";

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
