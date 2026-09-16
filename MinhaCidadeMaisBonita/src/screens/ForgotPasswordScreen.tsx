import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { requestPasswordRecovery } from "../services/passwordRecovery";
import { colors } from "../theme";
export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  async function send() {
    setBusy(true);
    try {
      await requestPasswordRecovery(email);
      Alert.alert("Confira seu e-mail", "Enviamos as instruções.");
    } catch (error) {
      Alert.alert(
        "Falha",
        error instanceof Error ? error.message : "Tente novamente",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={s.page}>
      <AppHeader title="Recuperar conta" onBack={onBack} />
      <ScreenContainer center>
        <FormField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <PrimaryButton
          label={busy ? "Enviando..." : "Enviar link"}
          onPress={send}
          disabled={busy}
        />
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
});
