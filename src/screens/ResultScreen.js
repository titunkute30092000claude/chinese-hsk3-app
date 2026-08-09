import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import SealStamp from "../components/SealStamp";

export default function ResultScreen({ score, total, streak, onRestart, onHome }) {
  const passed = score >= total * 0.6;
  return (
    <View style={styles.container}>
      <SealStamp size={110} char={passed ? "对" : "习"} animate animKey="result" />
      <Text style={styles.score}>
        {score}/{total} correct
      </Text>
      <View style={styles.streakRow}>
        <Feather name="zap" size={16} color={COLORS.seal} />
        <Text style={styles.streakText}>
          {streak} day{streak === 1 ? "" : "s"} learned
        </Text>
      </View>
      <Text style={styles.caption}>
        {passed ? "Good work. Your stamp collection grows." : "A slow start still counts. Try again to earn your stamp."}
      </Text>
      <View style={styles.buttons}>
        <Pressable onPress={onRestart} style={styles.primaryButton}>
          <Feather name="rotate-ccw" size={16} color={COLORS.paper} />
          <Text style={styles.primaryButtonText}>Practice again</Text>
        </Pressable>
        <Pressable onPress={onHome} style={styles.secondaryButton}>
          <Feather name="home" size={16} color={COLORS.ink} />
          <Text style={styles.secondaryButtonText}>Back home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingHorizontal: 24, paddingTop: 56 },
  score: { fontFamily: FONT.displayBold, fontSize: 24, color: COLORS.ink, marginTop: 20 },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  streakText: { fontFamily: FONT.mono, color: COLORS.ink },
  caption: { fontSize: 14, textAlign: "center", marginTop: 24, color: COLORS.inkSoft, fontFamily: FONT.body },
  buttons: { width: "100%", gap: 12, marginTop: 32 },
  primaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 999, backgroundColor: COLORS.ink },
  primaryButtonText: { fontFamily: FONT.bodySemi, color: COLORS.paper },
  secondaryButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 999, borderWidth: 1.5, borderColor: COLORS.ink },
  secondaryButtonText: { fontFamily: FONT.bodySemi, color: COLORS.ink },
});
