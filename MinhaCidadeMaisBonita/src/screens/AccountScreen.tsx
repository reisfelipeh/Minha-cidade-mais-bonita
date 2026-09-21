import { Alert, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";
import { colors } from "../theme";
export function AccountScreen({
  onBack,
  onDeleted,
}: {
  onBack: () => void;
  onDeleted: () => void;
}) {
  const { user, signOut } = useAuth();
  async function remove() {
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) return Alert.alert("Falha", error.message);
    onDeleted();
  }
  return (
    <View style={s.page}>
      <AppHeader title="Minha conta" onBack={onBack} />
      <ScreenContainer center>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.space}>
          <PrimaryButton label="Sair" onPress={() => void signOut()} />
        </View>
        <PrimaryButton
          label="Excluir e anonimizar conta"
          variant="danger"
          onPress={() =>
            Alert.alert("Excluir conta", "Esta ação é permanente.", [
              { text: "Cancelar" },
              {
                text: "Excluir",
                style: "destructive",
                onPress: () => void remove(),
              },
            ])
          }
        />
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  email: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  space: { marginVertical: 18 },
});
