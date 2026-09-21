import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme";
import { UrbanOccurrence } from "../types";
export function DetailScreen({
  item,
  authenticated,
  onBack,
  onRequireAuth,
  onUpdate,
}: {
  item: UrbanOccurrence;
  authenticated: boolean;
  onBack: () => void;
  onRequireAuth: () => void;
  onUpdate: (status: UrbanOccurrence["status"], note: string) => Promise<void>;
}) {
  function update() {
    if (!authenticated) return onRequireAuth();
    Alert.alert("Confirmar", "Marcar como resolvido?", [
      { text: "Cancelar" },
      {
        text: "Confirmar",
        onPress: () => void onUpdate("RESOLVIDO", "Resolução confirmada."),
      },
    ]);
  }
  return (
    <View style={s.page}>
      <AppHeader title="Detalhes" onBack={onBack} />
      <ScreenContainer>
        <Image source={{ uri: item.photo_url }} style={s.image} />
        <Text style={s.category}>{item.category}</Text>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.text}>{item.description}</Text>
        <Text style={s.meta}>
          📍 {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
        </Text>
        {item.status !== "RESOLVIDO" ? (
          <PrimaryButton label="Confirmar como resolvido" onPress={update} />
        ) : null}
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  image: { width: "100%", height: 250, borderRadius: 22, marginBottom: 16 },
  category: { color: colors.primary, fontWeight: "900" },
  title: { fontSize: 24, fontWeight: "900", color: colors.text, marginTop: 8 },
  text: { color: colors.muted, lineHeight: 22, marginVertical: 10 },
  meta: { color: colors.muted, marginBottom: 20 },
});
