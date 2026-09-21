import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { Accelerometer } from "expo-sensors";
import { AppHeader } from "../components/AppHeader";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenContainer } from "../components/ScreenContainer";
import { getOccurrenceLocation } from "../services/device";
import { createOccurrence } from "../services/occurrences";
import { colors } from "../theme";
import { Category, CitySelection } from "../types";
const categories: Category[] = [
  "Via pública",
  "Iluminação",
  "Água ou esgoto",
  "Limpeza urbana",
  "Sinalização",
  "Calçada ou acessibilidade",
  "Vegetação",
  "Equipamento público",
  "Outro",
];
export function ReportScreen({
  city,
  onBack,
  onSaved,
}: {
  city: CitySelection;
  onBack: () => void;
  onSaved: () => void;
}) {
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState<Category>("Via pública");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [location, setLocation] = useState<Awaited<
    ReturnType<typeof getOccurrenceLocation>
  > | null>(null);
  const [magnitude, setMagnitude] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  useEffect(() => {
    Accelerometer.setUpdateInterval(350);
    const sub = Accelerometer.addListener(({ x, y, z }) =>
      setMagnitude(Math.sqrt(x * x + y * y + z * z)),
    );
    return () => sub.remove();
  }, []);
  async function openCamera() {
    if (!permission?.granted) {
      const value = await requestPermission();
      if (!value.granted) return Alert.alert("Câmera não autorizada.");
    }
    setCameraOpen(true);
  }
  async function take() {
    const result = await camera.current?.takePictureAsync({ quality: 0.72 });
    if (result) {
      setPhoto(result.uri);
      setCameraOpen(false);
    }
  }
  async function save() {
    if (
      !photo ||
      !location ||
      title.trim().length < 4 ||
      description.trim().length < 10
    )
      return Alert.alert("Inclua foto, localização, título e descrição.");
    setBusy(true);
    setProgress("Preparando a fotografia...");
    try {
      const base64 = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await createOccurrence(
        {
          author_id: null,
          title: title.trim(),
          category,
          description: description.trim(),
          reference: reference.trim(),
          attention: "Normal",
          city: city.city,
          state: city.state,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          sensor_magnitude: Number(magnitude.toFixed(3)),
          capture_condition:
            Math.abs(magnitude - 1) < 0.2 ? "Estável" : "Com movimento",
          status: "ATIVO",
        },
        base64,
        "jpg",
        setProgress,
      );
      onSaved();
    } catch (error) {
      Alert.alert(
        "Não foi possível publicar",
        error instanceof Error ? error.message : "Erro inesperado",
      );
    } finally {
      setBusy(false);
      setProgress("");
    }
  }
  return (
    <View style={s.page}>
      <AppHeader title="Novo relato" onBack={onBack} />
      <ScreenContainer>
        {photo ? (
          <Image source={{ uri: photo }} style={s.photo} />
        ) : (
          <PrimaryButton label="Tirar fotografia" onPress={openCamera} />
        )}
        <Text style={s.label}>Categoria</Text>
        <View style={s.categories}>
          {categories.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={[s.chip, item === category && s.selected]}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </View>
        <FormField label="Título" value={title} onChangeText={setTitle} />
        <FormField
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <FormField
          label="Referência"
          value={reference}
          onChangeText={setReference}
        />
        <PrimaryButton
          label={location ? "Localização capturada" : "Capturar localização"}
          onPress={() =>
            void getOccurrenceLocation()
              .then(setLocation)
              .catch(() => Alert.alert("Falha na localização"))
          }
        />
        {progress ? <Text style={s.progress}>{progress}</Text> : null}
        <View style={s.save}>
          <PrimaryButton
            label={busy ? "Publicando..." : "Registrar problema"}
            onPress={save}
            disabled={busy}
          />
        </View>
      </ScreenContainer>
      <Modal visible={cameraOpen} animationType="slide">
        <CameraView ref={camera} style={s.camera}>
          <Pressable style={s.capture} onPress={() => void take()}>
            <Text style={s.captureText}>CAPTURAR</Text>
          </Pressable>
        </CameraView>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  photo: { width: "100%", height: 230, borderRadius: 20, marginBottom: 18 },
  label: {
    fontWeight: "900",
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.lightGreen, borderColor: colors.primary },
  progress: {
    color: colors.primary,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
  },
  save: { marginTop: 12 },
  camera: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  capture: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 40,
  },
  captureText: { fontWeight: "900" },
});
