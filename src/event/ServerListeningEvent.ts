import {Event} from "./Event";
import {Server} from "../Server";

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
