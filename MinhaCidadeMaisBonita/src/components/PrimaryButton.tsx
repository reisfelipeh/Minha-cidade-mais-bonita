import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme";
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger";
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        s.button,
        variant === "outline" && s.outline,
        variant === "danger" && s.danger,
        disabled && s.disabled,
      ]}
    >
      <Text style={[s.label, variant === "outline" && s.outlineLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
  label: { color: "#FFF", fontWeight: "900", fontSize: 15 },
  outlineLabel: { color: colors.primary },
});
