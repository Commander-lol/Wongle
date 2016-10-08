// @flow
import Packet from '../server/Packet'

export type Middleware = (socket: Packet, next: () => void) => void | Promise<void> | Generator<any, void, void> // Generators can yield anything, it is ignored