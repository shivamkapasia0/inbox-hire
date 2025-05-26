import { NextResponse } from 'next/server';

// Store active connections
const clients = new Set();

// Function to send data to all connected clients
export function sendToAllClients(data) {
  console.log('Sending to all clients:', data);
  console.log('Number of connected clients:', clients.size);
  
  if (clients.size === 0) {
    console.log('No clients connected to send updates to');
    return;
  }

  const message = `data: ${JSON.stringify(data)}\n\n`;
  const disconnectedClients = new Set();

  clients.forEach(client => {
    try {
      if (client.isActive) {
        client.write(message);
        console.log('Successfully sent message to client');
      } else {
        disconnectedClients.add(client);
      }
    } catch (error) {
      console.error('Error sending to client:', error);
      disconnectedClients.add(client);
    }
  });

  // Clean up disconnected clients
  disconnectedClients.forEach(client => {
    clients.delete(client);
    console.log('Removed disconnected client');
  });
}

// Send heartbeat every 30 seconds to keep connections alive
setInterval(() => {
  sendToAllClients({ type: 'heartbeat', timestamp: Date.now() });
}, 30000);

export async function GET() {
  console.log('New SSE connection request received');
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set of connected clients
      const client = {
        isActive: true,
        write: (data) => {
          try {
            if (client.isActive) {
              controller.enqueue(encoder.encode(data));
              console.log('Data written to client stream');
            }
          } catch (error) {
            console.error('Error writing to client:', error);
            client.isActive = false;
          }
        }
      };
      clients.add(client);
      console.log(`Client connected. Total clients: ${clients.size}`);

      // Send initial connection message
      const initialMessage = { type: 'connected', timestamp: Date.now() };
      client.write(`data: ${JSON.stringify(initialMessage)}\n\n`);
      console.log('Sent initial connection message:', initialMessage);

      // Remove client when connection closes
      return () => {
        console.log('Client disconnected');
        client.isActive = false;
        clients.delete(client);
        console.log(`Remaining clients: ${clients.size}`);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in Nginx
    },
  });
} 