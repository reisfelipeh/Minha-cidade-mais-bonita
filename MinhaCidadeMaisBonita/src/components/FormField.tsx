import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors } from "../theme";
export function FormField({
  label,
  multiline,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        style={[s.input, multiline && s.multi]}
      />
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontWeight: "800", color: colors.text, marginBottom: 8 },
  input: {
    minHeight: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 14,
  },
  multi: { minHeight: 110, textAlignVertical: "top" },
});
