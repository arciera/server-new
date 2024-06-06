import {ConnectionEvent} from "./ConnectionEvent";
import {Connection} from "../Connection";
import {Packet} from "../Packet";

/**
 * A full packet was received. The {@link Packet#isComplete} should be true.
 */
export class PacketEvent extends ConnectionEvent {
    /**
     * Create new packet event
     * @param connection The connection that sent the packet
     * @param packet The complete packet
     */
    public constructor(
        connection: Connection,
        /**
         * The complete packet
         */
        public readonly packet: Packet
    ) {
        super(connection);
    }
}
