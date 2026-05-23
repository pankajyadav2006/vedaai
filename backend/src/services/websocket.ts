import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

const clients = new Map<string, WebSocket>();

export const initWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'subscribe' && data.jobId) {
          clients.set(data.jobId, ws);
          console.log(`Client subscribed to job: ${data.jobId}`);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      // Find and remove the client from the map
      for (const [jobId, client] of clients.entries()) {
        if (client === ws) {
          clients.delete(jobId);
          console.log(`Client unsubscribed from job: ${jobId}`);
          break;
        }
      }
    });
  });

  return wss;
};

export const emitToClient = (jobId: string, payload: object) => {
  const ws = clients.get(jobId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
};
