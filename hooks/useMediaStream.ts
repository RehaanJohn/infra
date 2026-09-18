import { useState, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_MEDIA_CONSTRAINTS } from '@/lib/webrtc/config';

export function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isStarting = useRef(false);

  const startStream = useCallback(async () => {
    if (isStarting.current || streamRef.current) return;
    
    try {
      isStarting.current = true;
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported. Ensure you are on HTTPS or localhost.');
      }
      const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_MEDIA_CONSTRAINTS);
      streamRef.current = stream;
      setLocalStream(stream);
      setError(null);
    } catch (err: any) {
      console.error('Error accessing media devices.', err);
      setError(err.message || 'Could not access camera or microphone.');
    } finally {
      isStarting.current = false;
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setLocalStream(null);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return { localStream, error, startStream, stopStream, toggleAudio, toggleVideo };
}
