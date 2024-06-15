import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

// import type { NextRequest } from "next/server";

import { env } from "~/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 },
    );
  }

  let done = false;
  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) {
      done = true;
    } else {
      chunks.push(value);
    }
  }

  const audioBuffer = Buffer.concat(chunks);

  try {
    const file = await toFile(audioBuffer, "file.mp3");

    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      prompt: "Transcript the following audio:",
      response_format: "json",
      temperature: 0,
    });

    console.log("Transcription response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to transcribe audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
