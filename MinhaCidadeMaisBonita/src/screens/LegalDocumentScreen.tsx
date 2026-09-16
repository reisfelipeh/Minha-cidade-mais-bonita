import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme";
const terms = [
  "Use o aplicativo com responsabilidade.",
  "Não publique dados pessoais ou conteúdo ofensivo.",
  "O serviço não substitui canais oficiais ou emergências.",
];
const privacy = [
  "Nome, e-mail, fotografia e localização são usados para operar o serviço.",
  "O e-mail não é exibido publicamente.",
  "A exclusão da conta anonimiza a autoria dos relatos.",
];
export function LegalDocumentScreen({
  document,
  onBack,
}: {
  document: "TERMS" | "PRIVACY";
  onBack: () => void;
}) {
  const items = document === "TERMS" ? terms : privacy;
  return (
    <View style={s.page}>
      <AppHeader
        title={
          document === "TERMS" ? "Termos de Uso" : "Política de Privacidade"
        }
        onBack={onBack}
      />
      <ScreenContainer>
        {items.map((item, index) => (
          <View key={item} style={s.section}>
            <Text style={s.title}>
              {index + 1}.{" "}
              {document === "TERMS" ? "Condição de uso" : "Tratamento de dados"}
            </Text>
            <Text style={s.text}>{item}</Text>
          </View>
        ))}
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  section: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },
  title: { fontWeight: "900", fontSize: 18, color: colors.text },
  text: { color: colors.muted, lineHeight: 22, marginTop: 8 },
});
