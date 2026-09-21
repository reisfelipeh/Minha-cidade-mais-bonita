import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { detectCity } from "../services/device";
import { colors } from "../theme";
import { CitySelection } from "../types";
export function CityScreen({
  initial,
  onBack,
  onConfirm,
}: {
  initial: CitySelection | null;
  onBack: () => void;
  onConfirm: (city: CitySelection) => void;
}) {
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  async function locate() {
    try {
      const value = await detectCity();
      setCity(value.city);
      setState(value.state);
    } catch (error) {
      Alert.alert(
        "Localização",
        error instanceof Error ? error.message : "Falha",
      );
    }
  }
  function confirm() {
    if (!city.trim() || !state.trim())
      return Alert.alert("Preencha cidade e estado.");
    onConfirm({
      city: city.trim(),
      state: state.trim(),
      source: "MANUAL",
      confirmedAt: new Date().toISOString(),
    });
  }
  return (
    <View style={s.page}>
      <AppHeader title="Confirme sua cidade" onBack={onBack} />
      <ScreenContainer center>
        <Text style={s.icon}>📍</Text>
        <Text style={s.title}>Onde você quer colaborar?</Text>
        <Text style={s.help}>Use o GPS ou informe manualmente.</Text>
        <View style={s.space}>
          <PrimaryButton label="Usar minha localização" onPress={locate} />
        </View>
        <FormField label="Cidade" value={city} onChangeText={setCity} />
        <FormField label="Estado" value={state} onChangeText={setState} />
        <PrimaryButton label="Confirmar cidade" onPress={confirm} />
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  icon: { fontSize: 40 },
  title: { fontSize: 23, fontWeight: "900", color: colors.text, marginTop: 8 },
  help: { color: colors.muted, marginTop: 6 },
  space: { marginVertical: 20 },
});
