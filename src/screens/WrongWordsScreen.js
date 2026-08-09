import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";
import SealStamp from "../components/SealStamp";
import WrongWordRow from "../components/WrongWordRow";

export default function WrongWordsScreen({ wrongWords, onBack, onPractice, onRemove }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} accessibilityLabel="Back home">
          <Feather name="x" size={20} color={COLORS.inkSoft} />
        </Pressable>
        <Text style={styles.title}>Wrong words record · 错题本</Text>
      </View>

      {wrongWords.length === 0 ? (
        <View style={styles.empty}>
          <SealStamp size={72} char="好" />
          <Text style={styles.emptyText}>
            No wrong words yet. Anything you miss during practice will collect here so you can drill it separately.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>
            {wrongWords.length} word{wrongWords.length === 1 ? "" : "s"} you've missed at least once, worst first. Swipe a word right to remove it.
          </Text>
          <FlatList
            style={{ flex: 1, marginTop: 12 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={wrongWords}
            keyExtractor={(w) => w.hanzi}
            renderItem={({ item }) => <WrongWordRow word={item} onRemove={onRemove} />}
          />
          <View style={styles.footer}>
            <Pressable onPress={onPractice} style={styles.practiceButton}>
              <Text style={styles.practiceButtonText}>Practice wrong words</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  title: { fontFamily: FONT.displayBold, fontSize: 18, color: COLORS.ink },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyText: { marginTop: 16, fontSize: 14, textAlign: "center", color: COLORS.inkSoft, fontFamily: FONT.body },
  subtitle: { paddingHorizontal: 20, marginTop: 4, fontSize: 14, color: COLORS.inkSoft, fontFamily: FONT.body },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  practiceButton: { paddingVertical: 12, borderRadius: 999, backgroundColor: COLORS.seal, alignItems: "center" },
  practiceButtonText: { fontFamily: FONT.bodySemi, color: COLORS.paper },
});
