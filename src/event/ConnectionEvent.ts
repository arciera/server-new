import {Event} from "./Event";
import {Connection} from "../Connection";

/**
 * An event associated with a connection
 */
export class ConnectionEvent extends Event {
    /**
     * Create new event
     * @param connection The connection that triggered the event
     */
    protected constructor(
        /**
         * The connection that triggered the event
         */
        public readonly connection: Connection
    ) {
        super(connection.server);
    }
}
