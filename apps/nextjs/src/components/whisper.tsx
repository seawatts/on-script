"use client";

import { useRef, useState } from "react";

import { Button } from "@on-script/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@on-script/ui/card";
import { H1, H2, P, Prose, Text } from "@on-script/ui/typography";

export function Whisper() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceThreshold = 0.01; // Threshold to consider as silence
  const silenceDuration = 2000; // Duration of silence in ms to stop recording
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];

      const formData = new FormData();
      formData.append("file", audioBlob);

      try {
        const response = await fetch("/api/ai/whisper", {
          body: audioBlob,
          headers: {
            "Content-Type": "audio/wav",
          },
          method: "POST",
        });

        const data = (await response.json()) as { text: string };

        setTranscription(
          (previousTranscription) => `${previousTranscription}\n${data.text}`,
        );
      } catch (error) {
        console.error("Failed to transcribe audio:", error);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
    checkForSilence();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  };

  const checkForSilence = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedVolume = avgVolume / 128; // Normalize between 0 and 1

    if (normalizedVolume < silenceThreshold) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(
          handleStopRecording,
          silenceDuration,
        );
      }
    } else {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }

    requestAnimationFrame(checkForSilence);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Text>Choose a movie</Text>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transcription && <Prose>{transcription}</Prose>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </CardFooter>
    </Card>
  );
}
