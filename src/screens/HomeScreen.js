import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { VOCAB } from "../data/vocab";
import { getUnitNewWords, getUnitCumulativeWords, TOTAL_UNITS } from "../data/practice";
import { speak } from "../data/speech";
import Switch from "../components/Switch";

function usePulse(active) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 300, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, scale]);
  return scale;
}

export default function HomeScreen({
  streak,
  showPinyin,
  setShowPinyin,
  currentUnit,
  setCurrentUnit,
  wrongWordsCount,
  onStart,
  onOpenWrongWords,
}) {
  const newWords = getUnitNewWords(currentUnit);
  const cumulativeWords = getUnitCumulativeWords(currentUnit);
  const word = newWords[0];
  const progressPercent = Math.round((cumulativeWords.length / VOCAB.length) * 100);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const pulse = usePulse(isSpeaking);
  const playWord = () => speak(word.hanzi, { onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.wordmark}>拾字</Text>
          <Text style={styles.tagline}>shí zì · pick up chinese</Text>
        </View>
        <View style={styles.streakBadge}>
          <Feather name="zap" size={16} color={COLORS.seal} />
          <Text style={styles.streakText}>
            {streak} day{streak === 1 ? "" : "s"} learned
          </Text>
        </View>
      </View>

      <View style={styles.pinyinRow}>
        <Text style={styles.pinyinLabel}>Show pinyin</Text>
        <Switch checked={showPinyin} onChange={setShowPinyin} />
      </View>

      <View style={styles.wordCard}>
        <Text style={styles.wordCardLabel}>word of the day</Text>
        <View style={styles.wordCardBody}>
          <View>
            <Animated.Text style={[styles.hanzi, { transform: [{ scale: pulse }] }]} onPress={playWord}>
              {word.hanzi}
            </Animated.Text>
            <Text style={styles.wordMeta}>
              {showPinyin ? `${word.pinyin} · ${word.meaning}` : word.meaning}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable onPress={playWord} style={styles.speakerButton} accessibilityLabel="Play pronunciation">
              <Feather name="volume-2" size={18} color={COLORS.paper} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <View style={styles.navRow}>
        <Pressable
          onPress={() => setCurrentUnit(Math.max(1, currentUnit - 1))}
          disabled={currentUnit <= 1}
          style={[styles.navButton, currentUnit <= 1 && { opacity: 0.4 }]}
        >
          <Feather name="chevron-left" size={16} color={COLORS.ink} />
        </Pressable>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.roadTitle}>
            Road {currentUnit} <Text style={styles.roadOf}>of {TOTAL_UNITS}</Text>
          </Text>
          <Text style={styles.roadSubtitle}>
            +{newWords.length} new · {cumulativeWords.length} words total
          </Text>
        </View>
        <Pressable
          onPress={() => setCurrentUnit(Math.min(TOTAL_UNITS, currentUnit + 1))}
          disabled={currentUnit >= TOTAL_UNITS}
          style={[styles.navButton, currentUnit >= TOTAL_UNITS && { opacity: 0.4 }]}
        >
          <Feather name="chevron-right" size={16} color={COLORS.ink} />
        </Pressable>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{progressPercent}%</Text>
      </View>
      <Text style={styles.progressCaption}>
        {cumulativeWords.length} of {VOCAB.length} HSK 3.0 Level 3 words done
      </Text>

      <View style={styles.practiceCard}>
        <Pressable onPress={onStart} style={styles.beginButton}>
          <Text style={styles.beginButtonText}>Begin practice · 开始</Text>
        </Pressable>
      </View>

      <Pressable onPress={onOpenWrongWords} style={styles.wrongWordsButton}>
        <Text style={styles.wrongWordsButtonText}>Wrong words record · 错题本</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  wordmark: { fontFamily: FONT.displayBold, fontSize: 26, color: COLORS.ink, lineHeight: 28 },
  tagline: { fontFamily: FONT.monoItalic, fontSize: 11, color: COLORS.inkSoft },
  streakBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  streakText: { fontFamily: FONT.mono, fontWeight: "500", color: COLORS.ink },
  pinyinRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginTop: 12, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: COLORS.paperDark },
  pinyinLabel: { fontFamily: FONT.mono, fontSize: 12, color: COLORS.inkSoft },
  wordCard: { marginHorizontal: 20, marginTop: 12, padding: 20, borderRadius: 20, backgroundColor: COLORS.paperCard, borderWidth: 1, borderColor: COLORS.line },
  wordCardLabel: { fontFamily: FONT.mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: COLORS.inkSoft },
  wordCardBody: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 },
  hanzi: { fontFamily: FONT.hanziBold, fontSize: 48, color: COLORS.ink, lineHeight: 52 },
  wordMeta: { fontFamily: FONT.monoItalic, color: COLORS.inkSoft, marginTop: 6 },
  speakerButton: { padding: 12, borderRadius: 999, backgroundColor: COLORS.ink },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 20 },
  navButton: { padding: 8, borderRadius: 999, backgroundColor: COLORS.paperDark },
  roadTitle: { fontFamily: FONT.displayBold, fontSize: 16, color: COLORS.ink },
  roadOf: { fontFamily: FONT.mono, fontWeight: "500", fontSize: 12, color: COLORS.inkSoft },
  roadSubtitle: { fontFamily: FONT.mono, fontSize: 11, color: COLORS.inkSoft },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 20, marginTop: 12 },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: COLORS.line, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.seal },
  progressPercent: { fontFamily: FONT.mono, fontSize: 11, fontWeight: "500", color: COLORS.inkSoft, minWidth: 32, textAlign: "right" },
  progressCaption: { textAlign: "center", marginTop: 4, fontFamily: FONT.mono, fontSize: 10, color: COLORS.inkSoft },
  practiceCard: { marginHorizontal: 20, marginTop: 16, padding: 20, borderRadius: 20, backgroundColor: COLORS.paperDark },
  beginButton: { paddingVertical: 12, borderRadius: 999, backgroundColor: COLORS.ink, alignItems: "center" },
  beginButtonText: { fontFamily: FONT.bodySemi, color: COLORS.paper, fontSize: 15 },
  wrongWordsButton: { marginHorizontal: 20, marginTop: 12, paddingVertical: 12, borderRadius: 16, backgroundColor: COLORS.paperCard, borderWidth: 1.5, borderColor: COLORS.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  wrongWordsButtonText: { fontFamily: FONT.bodySemi, color: COLORS.ink },
  wrongWordsBadge: { minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: COLORS.seal, alignItems: "center", justifyContent: "center" },
  wrongWordsBadgeText: { fontFamily: FONT.mono, fontSize: 11, color: COLORS.paper },
});
