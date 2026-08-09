import * as Speech from "expo-speech";

// Plays Mandarin pronunciation via the device's built-in TTS voice.
// Quality depends on which zh-CN voice iOS/Android has installed —
// see the note in README.md about swapping this for real audio clips.
export function speak(text, { onStart, onEnd } = {}) {
  try {
    Speech.stop();
    Speech.speak(text, {
      language: "zh-CN",
      pitch: 1.0,
      rate: 0.85,
      onStart,
      onDone: onEnd,
      onStopped: onEnd,
      onError: onEnd,
    });
  } catch (e) {
    if (onEnd) onEnd();
  }
}
