import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, Image, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import { speak } from "../data/speech";
import SealStamp from "../components/SealStamp";
import { CORRECT_MEMES, WRONG_MEMES } from "../data/memes";

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

export default function QuizScreen({ quiz, onSelect, onNext, onExit, showPinyin, setShowPinyin, label }) {
  const q = quiz.questions[quiz.index];
  const total = quiz.questions.length;
  const isCorrectSelected = quiz.showFeedback && quiz.selected === q.meaning;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const pulse = usePulse(isSpeaking);
  const playWord = () => speak(q.hanzi, { onStart: () => setIsSpeaking(true), onEnd: () => setIsSpeaking(false) });

  const memeSrc = useMemo(() => {
    if (!quiz.showFeedback) return null;
    const pool = isCorrectSelected ? CORRECT_MEMES : WRONG_MEMES;
    return pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.index, quiz.showFeedback]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} accessibilityLabel="Exit practice">
          <Feather name="x" size={20} color={COLORS.inkSoft} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(quiz.index / total) * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {label} · {quiz.index + 1}/{total}
        </Text>
      </View>

      <View style={styles.pinyinRow}>
        <Text style={styles.pinyinLabel}>Show pinyin</Text>
        <SwitchInline checked={showPinyin} onChange={setShowPinyin} />
      </View>

      <View style={styles.hanziBlock}>
        <View style={styles.hanziRow}>
          <Animated.Text style={[styles.hanzi, { transform: [{ scale: pulse }] }]} onPress={playWord}>
            {q.hanzi}
          </Animated.Text>
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable onPress={playWord} style={styles.speakerButton} accessibilityLabel="Play pronunciation">
              <Feather name="volume-2" size={16} color={COLORS.ink} />
            </Pressable>
          </Animated.View>
        </View>
        {showPinyin && <Text style={styles.pinyinText}>{q.pinyin}</Text>}
        <Text style={styles.prompt}>What does this mean?</Text>
      </View>

      <View style={styles.optionsGrid}>
        {q.options.map((opt) => {
          const isThisCorrect = opt === q.meaning;
          const isSelected = quiz.selected === opt;
          let bg = COLORS.paperCard;
          let border = COLORS.line;
          let color = COLORS.ink;
          if (quiz.showFeedback) {
            if (isThisCorrect) {
              bg = COLORS.jadeSoft;
              border = COLORS.jade;
            } else if (isSelected) {
              bg = COLORS.sealSoft;
              border = COLORS.seal;
            } else {
              color = COLORS.inkSoft;
            }
          }
          return (
            <Pressable
              key={opt}
              disabled={quiz.showFeedback}
              onPress={() => onSelect(opt)}
              style={[styles.optionButton, { backgroundColor: bg, borderColor: border }]}
            >
              <Text style={{ color, fontFamily: FONT.bodyMedium, fontSize: 14 }}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {quiz.showFeedback && (
        <View style={styles.feedback}>
          {isCorrectSelected ? (
            <SealStamp size={56} animate animKey={quiz.index} />
          ) : (
            <Text style={styles.feedbackText}>correct answer: {q.meaning}</Text>
          )}
          {!!q.vietnamese && <Text style={styles.feedbackVietnamese}>VN: {q.vietnamese}</Text>}
          {!isCorrectSelected && (
            <Pressable onPress={onNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>
                {quiz.index + 1 >= total ? "See results" : "Next word · 下一个"}
              </Text>
            </Pressable>
          )}
          {!!memeSrc && <Image source={memeSrc} style={[styles.meme, { borderColor: isCorrectSelected ? COLORS.jade : COLORS.seal }]} />}
        </View>
      )}
    </ScrollView>
  );
}

// Small inline switch so QuizScreen doesn't need a second import path quirk
function SwitchInline({ checked, onChange }) {
  return (
    <Pressable onPress={() => onChange(!checked)} accessibilityRole="switch" accessibilityState={{ checked }}>
      <View style={{ width: 42, height: 24, borderRadius: 12, backgroundColor: checked ? COLORS.ink : COLORS.line, justifyContent: "center" }}>
        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.paper, marginLeft: checked ? 21 : 3 }} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: COLORS.line, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: COLORS.jade },
  progressLabel: { fontFamily: FONT.mono, fontSize: 12, color: COLORS.inkSoft },
  pinyinRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: 20, marginTop: 8, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 999, backgroundColor: COLORS.paperDark },
  pinyinLabel: { fontFamily: FONT.mono, fontSize: 12, color: COLORS.inkSoft },
  hanziBlock: { alignItems: "center", marginTop: 32, paddingHorizontal: 20 },
  hanziRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  hanzi: { fontFamily: FONT.hanziBold, fontSize: 64, color: COLORS.ink },
  speakerButton: { padding: 8, borderRadius: 999, backgroundColor: COLORS.paperDark },
  pinyinText: { fontFamily: FONT.monoItalic, color: COLORS.inkSoft, marginTop: 4 },
  prompt: { marginTop: 8, fontSize: 14, color: COLORS.inkSoft, fontFamily: FONT.body },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 32, gap: 12 },
  optionButton: { width: "47%", paddingVertical: 16, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1.5 },
  feedback: { alignItems: "center", marginTop: 32, gap: 8, paddingHorizontal: 20 },
  feedbackText: { fontFamily: FONT.mono, fontSize: 14, color: COLORS.inkSoft, textAlign: "center" },
  feedbackVietnamese: { fontFamily: FONT.monoItalic, fontSize: 14, color: COLORS.seal },
  nextButton: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999, backgroundColor: COLORS.ink },
  nextButtonText: { fontFamily: FONT.bodySemi, color: COLORS.paper },
  meme: { width: 170, height: 170, borderRadius: 16, borderWidth: 3, marginTop: 16 },
});
