import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { COLORS } from "../theme/colors";
import { FONT } from "../theme/fonts";

// A red ink-seal stamp, used as the "correct answer" reward — presses down
// with a little rotation and overshoot, like a real chop hitting paper.
export default function SealStamp({ size = 64, char = "对", animate = false, animKey = 0 }) {
  const scale = useRef(new Animated.Value(animate ? 2.4 : 1)).current;
  const opacity = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) return;
    scale.setValue(2.4);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 60 }),
      Animated.timing(opacity, { toValue: 1, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animKey, animate]);

  return (
    <Animated.View style={{ transform: [{ scale }, { rotate: "-8deg" }], opacity, width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" fill="none" stroke={COLORS.seal} strokeWidth="6" />
        <Circle cx="50" cy="50" r="36" fill="none" stroke={COLORS.seal} strokeWidth="2" />
        <SvgText
          x="50"
          y="63"
          fontSize="40"
          textAnchor="middle"
          fill={COLORS.seal}
          fontFamily={FONT.hanziBlack}
        >
          {char}
        </SvgText>
      </Svg>
    </Animated.View>
  );
}
