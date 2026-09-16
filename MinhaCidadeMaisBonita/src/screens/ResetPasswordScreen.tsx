import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { updateRecoveredPassword } from "../services/passwordRecovery";
import { colors } from "../theme";
export function ResetPasswordScreen({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  async function save() {
    if (password !== confirmation)
      return Alert.alert("As senhas são diferentes.");
    try {
      await updateRecoveredPassword(password);
      Alert.alert("Senha atualizada", "Você já pode entrar.", [
        { text: "Continuar", onPress: onFinished },
      ]);
    } catch (error) {
      Alert.alert(
        "Falha",
        error instanceof Error ? error.message : "Tente novamente",
      );
    }
  }
  return (
    <View style={s.page}>
      <AppHeader title="Criar nova senha" />
      <ScreenContainer center>
        <FormField
          label="Nova senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <FormField
          label="Confirmar senha"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry
        />
        <PrimaryButton label="Salvar nova senha" onPress={save} />
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
});
