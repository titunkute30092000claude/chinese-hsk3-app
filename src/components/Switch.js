import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { COLORS } from "../theme/colors";

export default function Switch({ checked, onChange }) {
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: checked ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  }, [checked, anim]);

  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: [COLORS.line, COLORS.ink] });
  const knobLeft = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 21] });

  return (
    <Pressable onPress={() => onChange(!checked)} accessibilityRole="switch" accessibilityState={{ checked }}>
      <Animated.View style={{ width: 42, height: 24, borderRadius: 12, backgroundColor: trackColor, justifyContent: "center" }}>
        <Animated.View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.paper, position: "absolute", left: knobLeft }} />
      </Animated.View>
    </Pressable>
  );
}
