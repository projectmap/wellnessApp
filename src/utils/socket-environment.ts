import { getTokens } from './authStore';

export const socketEnvironment = {
  // path:"/websocket/socket.io",
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 500,
  randomizationFactor: 0.5,
  auth: {
    token: getTokens().accessToken,
  },
  secure: true,
  transports: ['websocket'],
};
