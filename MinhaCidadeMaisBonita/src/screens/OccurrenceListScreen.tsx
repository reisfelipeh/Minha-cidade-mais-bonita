import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { EmptyState } from "../components/EmptyState";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme";
import { UrbanOccurrence } from "../types";
export function OccurrenceListScreen({
  title,
  items,
  resolved = false,
  onBack,
  onSelect,
}: {
  title: string;
  items: UrbanOccurrence[];
  resolved?: boolean;
  onBack: () => void;
  onSelect: (item: UrbanOccurrence) => void;
}) {
  return (
    <View style={s.page}>
      <AppHeader
        title={title}
        subtitle={`${items.length} registro(s)`}
        onBack={onBack}
      />
      <ScreenContainer>
        {items.length === 0 ? (
          <EmptyState resolved={resolved} />
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              style={s.card}
              onPress={() => onSelect(item)}
            >
              <Image source={{ uri: item.photo_url }} style={s.image} />
              <View style={s.body}>
                <Text style={s.category}>{item.category}</Text>
                <Text style={s.title}>{item.title}</Text>
                <Text style={s.text} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScreenContainer>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  card: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  image: { width: "100%", height: 170 },
  body: { padding: 16 },
  category: { color: colors.primary, fontWeight: "900" },
  title: { fontSize: 18, fontWeight: "900", color: colors.text, marginTop: 6 },
  text: { color: colors.muted, lineHeight: 21, marginTop: 5 },
});
