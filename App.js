import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
// Importing from each weight's specific subpath (rather than the package's
// top-level index) so Metro only bundles the exact files we use — the
// Noto Serif SC package alone is ~15MB PER WEIGHT because it covers
// thousands of Chinese glyphs, so pulling in all 8 weights instead of the
// 2 we actually use would bloat the app by well over 100MB for nothing.
import { Fraunces_500Medium } from "@expo-google-fonts/fraunces/500Medium";
import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces/600SemiBold";
import { Fraunces_700Bold } from "@expo-google-fonts/fraunces/700Bold";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono/500Medium";
import { IBMPlexMono_500Medium_Italic } from "@expo-google-fonts/ibm-plex-mono/500Medium_Italic";
import { NotoSerifSC_700Bold } from "@expo-google-fonts/noto-serif-sc/700Bold";
import { NotoSerifSC_900Black } from "@expo-google-fonts/noto-serif-sc/900Black";

import { COLORS } from "./src/theme/colors";
import { VOCAB } from "./src/data/vocab";
import {
  getUnitCumulativeWords,
  buildQuiz,
  QUESTIONS_PER_PRACTICE,
} from "./src/data/practice";
import { loadProgress, saveProgress } from "./src/data/persistence";

import HomeScreen from "./src/screens/HomeScreen";
import QuizScreen from "./src/screens/QuizScreen";
import ResultScreen from "./src/screens/ResultScreen";
import WrongWordsScreen from "./src/screens/WrongWordsScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    IBMPlexMono_500Medium,
    IBMPlexMono_500Medium_Italic,
    NotoSerifSC_700Bold,
    NotoSerifSC_900Black,
  });

  const [hydrated, setHydrated] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showPinyin, setShowPinyin] = useState(true);
  const [currentUnit, setCurrentUnit] = useState(1);
  const [wordStats, setWordStats] = useState({}); // { [hanzi]: { attempts, wrong } }

  const [screen, setScreen] = useState("home");
  const [quiz, setQuiz] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [quizSource, setQuizSource] = useState("road"); // "road" | "wrong"

  // Load saved progress once on launch
  useEffect(() => {
    (async () => {
      const saved = await loadProgress();
      if (saved) {
        if (typeof saved.streak === "number") setStreak(saved.streak);
        if (typeof saved.showPinyin === "boolean") setShowPinyin(saved.showPinyin);
        if (typeof saved.currentUnit === "number") setCurrentUnit(saved.currentUnit);
        if (saved.wordStats && typeof saved.wordStats === "object") setWordStats(saved.wordStats);
      }
      setHydrated(true);
    })();
  }, []);

  // Persist whenever the meaningful bits change (after initial load finishes)
  useEffect(() => {
    if (!hydrated) return;
    saveProgress({ streak, showPinyin, currentUnit, wordStats });
  }, [hydrated, streak, showPinyin, currentUnit, wordStats]);

  const wrongWords = Object.keys(wordStats)
    .filter((hanzi) => wordStats[hanzi].wrong > 0)
    .map((hanzi) => {
      const word = VOCAB.find((w) => w.hanzi === hanzi);
      const { attempts, wrong } = wordStats[hanzi];
      return word ? { ...word, attempts, wrong, wrongPercent: Math.round((wrong / attempts) * 100) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.wrongPercent - a.wrongPercent || b.wrong - a.wrong);

  function startQuiz() {
    const pool = getUnitCumulativeWords(currentUnit);
    setQuizSource("road");
    setQuiz({ questions: buildQuiz(QUESTIONS_PER_PRACTICE, pool), index: 0, score: 0, selected: null, showFeedback: false });
    setScreen("quiz");
  }

  function startWrongWordsQuiz() {
    if (wrongWords.length === 0) return;
    const n = Math.min(QUESTIONS_PER_PRACTICE, wrongWords.length);
    setQuizSource("wrong");
    setQuiz({ questions: buildQuiz(n, wrongWords), index: 0, score: 0, selected: null, showFeedback: false });
    setScreen("quiz");
  }

  function removeWrongWord(hanzi) {
    setWordStats((prev) => {
      const next = { ...prev };
      delete next[hanzi];
      return next;
    });
  }

  function advanceOrFinish(finalScore) {
    const isLast = quiz.index + 1 >= quiz.questions.length;
    if (isLast) {
      const passed = finalScore >= Math.ceil(quiz.questions.length * 0.6);
      if (quizSource === "road") {
        setStreak((s) => (passed ? s + 1 : s));
      }
      setLastResult({ score: finalScore, total: quiz.questions.length });
      setScreen("result");
    } else {
      setQuiz((prev) => ({ ...prev, index: prev.index + 1, selected: null, showFeedback: false }));
    }
  }

  function selectAnswer(opt) {
    if (!quiz || quiz.showFeedback) return;
    const q = quiz.questions[quiz.index];
    const isCorrect = opt === q.meaning;
    const newScore = quiz.score + (isCorrect ? 1 : 0);
    setQuiz((prev) => ({ ...prev, selected: opt, showFeedback: true, score: newScore }));
    setWordStats((prev) => {
      const existing = prev[q.hanzi] || { attempts: 0, wrong: 0 };
      return {
        ...prev,
        [q.hanzi]: { attempts: existing.attempts + 1, wrong: existing.wrong + (isCorrect ? 0 : 1) },
      };
    });
    if (isCorrect) {
      setTimeout(() => advanceOrFinish(newScore), 900);
    }
  }

  function goToNext() {
    if (!quiz || !quiz.showFeedback) return;
    advanceOrFinish(quiz.score);
  }

  if (!fontsLoaded || !hydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.paper }}>
        <ActivityIndicator color={COLORS.seal} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.paper }} edges={["top", "bottom"]}>
        <StatusBar barStyle="dark-content" />
        {screen === "home" && (
          <HomeScreen
            streak={streak}
            showPinyin={showPinyin}
            setShowPinyin={setShowPinyin}
            currentUnit={currentUnit}
            setCurrentUnit={setCurrentUnit}
            wrongWordsCount={wrongWords.length}
            onStart={startQuiz}
            onOpenWrongWords={() => setScreen("wrongWords")}
          />
        )}
        {screen === "wrongWords" && (
          <WrongWordsScreen
            wrongWords={wrongWords}
            onBack={() => setScreen("home")}
            onPractice={startWrongWordsQuiz}
            onRemove={removeWrongWord}
          />
        )}
        {screen === "quiz" && quiz && (
          <QuizScreen
            quiz={quiz}
            onSelect={selectAnswer}
            onNext={goToNext}
            onExit={() => setScreen(quizSource === "wrong" ? "wrongWords" : "home")}
            showPinyin={showPinyin}
            setShowPinyin={setShowPinyin}
            label={quizSource === "wrong" ? "Wrong words" : `Road ${currentUnit}`}
          />
        )}
        {screen === "result" && lastResult && (
          <ResultScreen
            score={lastResult.score}
            total={lastResult.total}
            streak={streak}
            onRestart={quizSource === "wrong" ? startWrongWordsQuiz : startQuiz}
            onHome={() => setScreen(quizSource === "wrong" ? "wrongWords" : "home")}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
