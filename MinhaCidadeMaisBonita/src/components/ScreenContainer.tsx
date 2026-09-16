import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../theme";
export function ScreenContainer({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={[s.scroll, center && s.center]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.content}>{children}</View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, alignItems: "center", padding: 20, paddingBottom: 42 },
  center: { justifyContent: "center" },
  content: { width: "100%", maxWidth: 620 },
});
