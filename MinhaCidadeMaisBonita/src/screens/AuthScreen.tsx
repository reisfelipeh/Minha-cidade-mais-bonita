import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { supabase } from "../services/supabase";
import { colors } from "../theme";
import { AuthMode } from "../types";
export function AuthScreen({
  mode,
  onModeChange,
  onBack,
  onSuccess,
  onForgotPassword,
  onOpenTerms,
  onOpenPrivacy,
}: {
  mode: AuthMode;
  onModeChange: (m: AuthMode) => void;
  onBack: () => void;
  onSuccess: () => void;
  onForgotPassword: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit() {
    if (!email.trim() || password.length < 6)
      return Alert.alert("Revise os dados");
    if (mode === "SIGNUP" && (!accepted || name.trim().length < 2))
      return Alert.alert("Leia e aceite os documentos.");
    setBusy(true);
    try {
      if (mode === "LOGIN") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim(),
              terms_accepted_at: new Date().toISOString(),
            },
            emailRedirectTo: "minhacidadebonita://auth/confirmed",
          },
        });
        if (error) throw error;
        Alert.alert("Confirme seu e-mail");
        onModeChange("LOGIN");
      }
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
      <AppHeader
        title={mode === "LOGIN" ? "Entrar" : "Criar conta"}
        onBack={onBack}
      />
      <ScreenContainer center>
        <View style={s.card}>
          {mode === "SIGNUP" ? (
            <FormField label="Nome" value={name} onChangeText={setName} />
          ) : null}
          <FormField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <FormField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {mode === "LOGIN" ? (
            <Pressable onPress={onForgotPassword}>
              <Text style={s.link}>Esqueci minha senha</Text>
            </Pressable>
          ) : (
            <View style={s.legal}>
              <Text>Antes de aceitar, leia:</Text>
              <Pressable onPress={onOpenTerms}>
                <Text style={s.link}>Termos de Uso</Text>
              </Pressable>
              <Pressable onPress={onOpenPrivacy}>
                <Text style={s.link}>Política de Privacidade</Text>
              </Pressable>
              <Pressable onPress={() => setAccepted((v) => !v)}>
                <Text style={s.accept}>
                  {accepted ? "☑" : "☐"} Li e aceito os documentos.
                </Text>
              </Pressable>
            </View>
          )}
          <PrimaryButton
            label={
              busy ? "Aguarde..." : mode === "LOGIN" ? "Entrar" : "Criar conta"
            }
            onPress={submit}
            disabled={busy}
          />
          <Pressable
            onPress={() => onModeChange(mode === "LOGIN" ? "SIGNUP" : "LOGIN")}
          >
            <Text style={s.switch}>
              {mode === "LOGIN" ? "Criar conta" : "Já tenho conta"}
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  link: { color: colors.primary, fontWeight: "900", marginBottom: 14 },
  legal: {
    backgroundColor: colors.lightGreen,
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
    rowGap: 10,
  },
  accept: { color: colors.text, fontWeight: "700" },
  switch: {
    color: colors.primary,
    fontWeight: "900",
    textAlign: "center",
    padding: 20,
  },
});
