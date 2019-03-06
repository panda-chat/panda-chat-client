// idea for how to handle constants taken from https://github.com/TypeStrong/ts-loader/issues/37#issuecomment-381375624
// It's a little ugly -- there's a suggestion on how to shorten it in the next comment in that thread, but it didn't compile.

declare const MESSAGES_ENDPOINT: string;
declare const WEBSOCKET_ENDPOINT: string;

const _MESSAGES_ENDPOINT = MESSAGES_ENDPOINT;
const _WEBSOCKET_ENDPOINT = WEBSOCKET_ENDPOINT;

export { _MESSAGES_ENDPOINT as MESSAGES_ENDPOINT };
export { _WEBSOCKET_ENDPOINT as WEBSOCKET_ENDPOINT };
