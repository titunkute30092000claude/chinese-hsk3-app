import React, { useRef } from "react";
import { Animated, PanResponder, View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";

const REVEAL = 84;

export default function WrongWordRow({ word, onRemove }) {
  const offset = useRef(new Animated.Value(0)).current;
  const offsetValue = useRef(0);
  offset.addListener(({ value }) => (offsetValue.current = value));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        const next = Math.max(0, Math.min(REVEAL, offsetValue.current + g.dx));
        offset.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const next = Math.max(0, Math.min(REVEAL, offsetValue.current + g.dx));
        Animated.spring(offset, { toValue: next > REVEAL / 2 ? REVEAL : 0, useNativeDriver: false, friction: 8 }).start();
      },
    })
  ).current;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.removeLayer, { width: REVEAL }]}>
        <Pressable onPress={() => onRemove(word.hanzi)} style={styles.removeButton}>
          <Feather name="trash-2" size={16} color={COLORS.paper} />
          <Text style={styles.removeLabel}>Remove</Text>
        </Pressable>
      </View>
      <Animated.View {...panResponder.panHandlers} style={[styles.row, { transform: [{ translateX: offset }] }]}>
        <View>
          <View style={styles.hanziRow}>
            <Text style={styles.hanzi}>{word.hanzi}</Text>
            <Text style={styles.pinyin}>{word.pinyin}</Text>
          </View>
          <Text style={styles.meaning}>
            {word.meaning}
            {word.vietnamese ? ` · ${word.vietnamese}` : ""}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.percent}>{word.wrongPercent}%</Text>
          <Text style={styles.fraction}>
            {word.wrong}/{word.attempts} wrong
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderBottomWidth: 1, borderBottomColor: COLORS.line, overflow: "hidden" },
  removeLayer: { position: "absolute", top: 0, bottom: 0, left: 0 },
  removeButton: { flex: 1, backgroundColor: COLORS.seal, alignItems: "center", justifyContent: "center", gap: 2 },
  removeLabel: { color: COLORS.paper, fontFamily: FONT.mono, fontSize: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    backgroundColor: COLORS.paper,
  },
  hanziRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  hanzi: { fontFamily: FONT.hanziBold, fontSize: 22, color: COLORS.ink },
  pinyin: { fontFamily: FONT.monoItalic, fontSize: 12, color: COLORS.inkSoft },
  meaning: { fontFamily: FONT.body, fontSize: 14, color: COLORS.inkSoft },
  percent: { fontFamily: FONT.mono, fontWeight: "600", fontSize: 15, color: COLORS.seal },
  fraction: { fontFamily: FONT.mono, fontSize: 10, color: COLORS.inkSoft },
});
