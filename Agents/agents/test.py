import json
import time

import requests

# --- Config ---
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "llama3.2:3b"  # must match `ollama pull`
SYSTEM_PROMPT = "You are a live call assistant. Summarize each transcript chunk in ONE short sentence. Extract action items if any."

# --- Parakeet live transcription ---
# pip install parakeet-stream
from parakeet_stream import Parakeet

pk = Parakeet(
    model_name="nvidia/parakeet-tdt-0.6b-v3",
    device="cuda",
    config="realtime"
)
live = pk.listen(verbose=True, sample_rate=16000)

print("Listening... speak into your microphone. Ctrl+C to stop.\n")

# --- Track what we've already sent ---
last_len = 0
MIN_NEW_CHARS = 40  # only call LLM after this much new text


def ask_llm(text: str) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 80,  # cap output tokens → faster
        },
    }
    try:
        r = requests.post(OLLAMA_URL, json=payload, timeout=30)
        r.raise_for_status()
        return r.json()["message"]["content"].strip()
    except Exception as e:
        return f"[LLM error] {e}"


# --- Main loop ---
try:
    while True:
        time.sleep(1.0)
        text = live.text or ""
        if len(text) - last_len < MIN_NEW_CHARS:
            continue

        new_chunk = text[last_len:]
        last_len = len(text)

        t0 = time.perf_counter()
        reply = ask_llm(new_chunk)
        dt = time.perf_counter() - t0

        print(f"\n[you]  ...{new_chunk.strip()[-120:]}")
        print(f"[llm]  {reply}   ({dt:.2f}s)\n")

except KeyboardInterrupt:
    print("\nStopping...")
    live.stop()
    print("\n=== Full transcript ===\n", live.text)
