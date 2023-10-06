import { Websocket } from 'ws';
export interface ActiveConnections {
    [id: string]: Websocket,
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

