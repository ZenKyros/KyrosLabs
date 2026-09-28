import os
import time

from dotenv import load_dotenv

load_dotenv()
import requests
from assemblyai.streaming.v3 import (
    BeginEvent,
    Encoding,
    RealTimeError,
    RealTimeEvents,
    RealTimeParameters,
    RealTimeTranscriber,
    RealTimeTranscriberOptions,
    TerminationEvent,
    TurnEvent,
)

# A live AAC (ADTS) internet radio stream, so no microphone is needed.
STREAM_URL = "https://14123.live.streamtheworld.com/WBBRAMAAC.aac"
RUN_SECONDS = 25


def on_begin(client: RealTimeTranscriber, event: BeginEvent):
    print(f"Session started: {event.id}")
    print("Connected. Streaming live radio for ~25 seconds.")


def on_turn(client: RealTimeTranscriber, event: TurnEvent):
    if event.transcript:
        print(event.transcript)


def on_terminated(client: RealTimeTranscriber, event: TerminationEvent):
    print(f"Session terminated: {event.audio_duration_seconds}s of audio processed")


def on_error(client: RealTimeTranscriber, error: RealTimeError):
    print(f"Error: {error}")


def main():
    client = RealTimeTranscriber(
        RealTimeTranscriberOptions(terminate_timeout=30.0),
        api_key=os.environ["ASSEMBLYAI_API_KEY"],
    )

    client.on(RealTimeEvents.Begin, on_begin)
    client.on(RealTimeEvents.Turn, on_turn)
    client.on(RealTimeEvents.Termination, on_terminated)
    client.on(RealTimeEvents.Error, on_error)

    # AAC is self-describing (ADTS headers carry the sample rate)
    client.connect(
        RealTimeParameters(speech_model="universal-3-5-pro", encoding=Encoding.aac)
    )

    # Pull the live radio stream and forward each chunk to the transcriber.
    response = requests.get(STREAM_URL, stream=True)
    deadline = time.time() + RUN_SECONDS
    try:
        for chunk in response.iter_content(chunk_size=4096):
            client.stream(chunk)
            if time.time() > deadline:
                break
    finally:
        response.close()
        # Terminate finalizes the open turn.
        # Keep the connection open long enough to receive the last final.
        client.disconnect(terminate=True)


if __name__ == "__main__":
    main()
