import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";
export function AppHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <SafeAreaView edges={["top"]} style={s.safe}>
      <View style={s.header}>
        {onBack ? (
          <Pressable onPress={onBack} style={s.back}>
            <View style={s.chevron} />
          </Pressable>
        ) : null}
        <View style={s.text}>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { backgroundColor: colors.primary },
  header: {
    minHeight: 96,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,.16)",
  },
  chevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#FFF",
    transform: [{ rotate: "45deg" }],
    marginLeft: 5,
  },
  text: { flex: 1 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "900" },
  subtitle: { color: "#D1E8E1", marginTop: 4 },
});
