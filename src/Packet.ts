/**
 * A packet
 */
export class Packet {
    readonly #buffer: Buffer;

    /**
     * Create a new packet
     * @param buffer The packet data. Use `Buffer.alloc(0)` or leave empty if you plan to write a packet
     */
    public constructor(buffer: Buffer = Buffer.alloc(0)) {
        this.#buffer = buffer;
    }

    /**
     * Get packet data
     */
    public buffer(): Buffer {
        return this.#buffer;
    }

    /**
     * Check if this packet is complete
     *
     * A VarInt is read from the beginning of the packet and compared to the packet's current buffer length.
     */
    public isComplete(): boolean {
        return this.buffer().byteLength === Packet.readVarInt(this.buffer()).value;
    }

    /**
     * Parse VarInt from the beginning of a buffer
     * @param data
     * @param offset
     */
    public static readVarInt(data: Buffer, offset: number = 0): Packet.ParseResult<number> {
        let value = 0;
        let shift = 0;
        let byte = 0;
        let index = offset;

        do {
            byte = data[index++]!;
            value += (byte & 0x7F) << shift;
            shift += 7;
        } while (byte & 0x80);

        return new Packet.ParseResult(value, index - offset);
    }

    /**
     * Write VarInt
     * @param value Must be between `-2³¹` and `2³¹ - 1` (inclusive)
     */
    public static writeVarInt(value: number): Buffer {
        if (value >= 2_147_483_648) throw new RangeError("Maximum VarInt value is 2,147,483,647 (= 2³¹ - 1)");
        if (value < -2_147_483_648) throw new RangeError("Minimum VarInt value is -2,147,483,648 (= -2³¹)");
        const data: number[] = [];
        do {
            let byte = value & 0x7F;
            value >>>= 7;
            if (value !== 0) {
                byte |= 0x80;
            }
            data.push(byte);
        } while (value !== 0);

        return Buffer.from(data);
    }
}

export namespace Packet {
    export class ParseResult<T> {
        constructor(
            public readonly value: T,
            public readonly length: number
        ) {}
    }
}
