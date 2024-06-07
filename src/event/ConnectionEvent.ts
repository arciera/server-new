import {Event} from "./Event.js";
import {Connection} from "../Connection.js";

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
