import { useEffect } from 'react';
import { useJobStore } from '../stores/jobStore';

export function useJobSocket(jobId: string | null) {
  const { updateProgress, setComplete, setFailed } = useJobStore();

  useEffect(() => {
    if (!jobId) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'subscribe', jobId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'progress') {
          updateProgress(data.percent, data.message);
        } else if (data.type === 'complete') {
          setComplete(data.paperId);
        } else if (data.type === 'error') {
          setFailed(data.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setFailed('Connection to progress server lost');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [jobId, updateProgress, setComplete, setFailed]);
}
