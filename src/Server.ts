import net from "node:net";
import {ConnectedEvent} from "./event/ConnectedEvent";
import {Connection} from "./Connection";
import {ServerListeningEvent} from "./event/ServerListeningEvent";
import {PluginManager} from "./PluginManager";
import {EventEmitter} from "./EventEmitter";

/**
 * Arciera server
 */
export class Server extends EventEmitter {
    /**
     * Create new server
     * @param port port on which the server is listening for connections
     */
    public constructor(
        /**
         * Port on which the server is listening for connections
         */
        public readonly port: number
    ) {
        super();
    }

    /**
     * This server's plugin manager
     */
    public plugins = new PluginManager(this);

    /**
     * Opens the server for connections
     */
    public async listen() {
        await new Promise(resolve => {
            this.tcpServer.once("listening", resolve);
            this.tcpServer.listen(this.port);
        });
        this.emit(new ServerListeningEvent(this));
    }

    private tcpServer: net.Server = new net.Server(this.connectionListener.bind(this));

    private connectionListener (socket: net.Socket) {
        this.emit(new ConnectedEvent(new Connection(this, socket)));
    }
}
