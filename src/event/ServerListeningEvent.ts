import {Event} from "./Event.js";
import {Server} from "../Server.js";

/**
 * The server is listening and open for connections
 */
export class ServerListeningEvent extends Event {
    /**
     * Create new server listening event
     * @param server
     */
    public constructor(server: Server) {
        super(server);
    }
}
