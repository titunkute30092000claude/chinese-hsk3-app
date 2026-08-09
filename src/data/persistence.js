import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "shizi-progress-v1";

// Everything we want to remember between app launches lives in one object,
// saved as a single JSON blob — simplest possible persistence for this app.
export async function loadProgress() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load saved progress", e);
    return null;
  }
}

export async function saveProgress(progress) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn("Failed to save progress", e);
  }
}
