import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../theme";
export function WelcomeScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <SafeAreaView style={s.page}>
      <View style={s.content}>
        <Text style={s.mark}>MC</Text>
        <Text style={s.eyebrow}>MINHA CIDADE MAIS BONITA</Text>
        <Text style={s.title}>
          Cuidar da cidade começa com um olhar atento.
        </Text>
        <Text style={s.text}>
          Consulte problemas publicamente. Para registrar ou atualizar uma
          ocorrência, entre com uma conta confirmada.
        </Text>
        <View style={s.notice}>
          <Text style={s.noticeText}>
            Projeto comunitário e educacional. Não substitui canais oficiais.
          </Text>
        </View>
        <PrimaryButton label="Continuar" onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.primary },
  content: {
    flex: 1,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    padding: 26,
  },
  mark: {
    width: 62,
    height: 62,
    borderRadius: 20,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "900",
    fontSize: 20,
    backgroundColor: colors.accent,
  },
  eyebrow: {
    color: "#A7D8CA",
    fontWeight: "900",
    letterSpacing: 1.4,
    marginTop: 25,
  },
  title: {
    color: "#FFF",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "900",
    marginTop: 14,
  },
  text: { color: "#D9ECE6", lineHeight: 23, marginTop: 15 },
  notice: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,.1)",
    marginVertical: 24,
  },
  noticeText: { color: "#E7F4F0" },
});
