import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
export function EmptyState({ resolved = false }: { resolved?: boolean }) {
  return (
    <View style={s.wrap}>
      <View style={s.circle}>
        <Text style={s.plant}>🌱</Text>
      </View>
      <Text style={s.title}>
        {resolved ? "Nenhum problema resolvido ainda" : "Nenhum problema ativo"}
      </Text>
      <Text style={s.text}>
        {resolved
          ? "Quando uma melhoria for confirmada, ela aparecerá aqui."
          : "Que boa notícia! Não há relatos ativos para esta cidade."}
      </Text>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: {
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  circle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGreen,
    marginBottom: 22,
  },
  plant: { fontSize: 58 },
  title: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  text: {
    maxWidth: 320,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9,
  },
});
