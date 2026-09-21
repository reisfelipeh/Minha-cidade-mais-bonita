import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, shadow } from "../theme";
import { CitySelection, ScreenName } from "../types";
export function HomeScreen({
  city,
  active,
  resolved,
  user,
  onChangeCity,
  onNavigate,
  onAuth,
}: {
  city: CitySelection;
  active: number;
  resolved: number;
  user: boolean;
  onChangeCity: () => void;
  onNavigate: (s: ScreenName) => void;
  onAuth: () => void;
}) {
  return (
    <ScrollView style={s.page}>
      <SafeAreaView style={s.hero}>
        <View style={s.inner}>
          <View style={s.row}>
            <Text style={s.brand}>Minha Cidade mais Bonita</Text>
            <Pressable onPress={onAuth}>
              <Text style={s.account}>{user ? "Conta" : "Entrar"}</Text>
            </Pressable>
          </View>
          <Pressable onPress={onChangeCity} style={s.city}>
            <Text style={s.cityName}>
              📍 {city.city} - {city.state}
            </Text>
            <Text style={s.help}>Toque para alterar</Text>
          </Pressable>
          <Text style={s.title}>Juntos, podemos transformar cada lugar.</Text>
        </View>
      </SafeAreaView>
      <View style={s.content}>
        <View style={s.stats}>
          <Text style={s.stat}>{active} ativos</Text>
          <Text style={s.stat}>{resolved} resolvidos</Text>
        </View>
        <Action
          title="Relatar um problema"
          onPress={() => (user ? onNavigate("REPORT") : onAuth())}
        />
        <Action
          title="Ver problemas ativos"
          onPress={() => onNavigate("ACTIVE")}
        />
        <Action
          title="Problemas resolvidos"
          onPress={() => onNavigate("RESOLVED")}
        />
      </View>
    </ScrollView>
  );
}
function Action({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={s.action} onPress={onPress}>
      <Text style={s.actionText}>{title}</Text>
      <Text style={s.arrow}>›</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  hero: { backgroundColor: colors.primary },
  inner: {
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
    padding: 20,
    paddingBottom: 32,
  },
  row: { flexDirection: "row", alignItems: "center" },
  brand: { flex: 1, color: "#FFF", fontWeight: "900", fontSize: 17 },
  account: { color: "#FFF", fontWeight: "900", padding: 10 },
  city: {
    backgroundColor: "rgba(255,255,255,.12)",
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
  },
  cityName: { color: "#FFF", fontSize: 19, fontWeight: "900" },
  help: { color: "#D9ECE6", marginTop: 4 },
  title: {
    color: "#FFF",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    marginTop: 24,
  },
  content: {
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
    padding: 18,
    rowGap: 14,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 20,
    ...shadow,
  },
  stat: { color: colors.primary, fontWeight: "900" },
  action: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: { flex: 1, fontWeight: "900", color: colors.text },
  arrow: { fontSize: 26, color: colors.primary },
});
