import * as Location from "expo-location";
export async function detectCity() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted")
    throw new Error("Localização não autorizada.");
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const [place] = await Location.reverseGeocodeAsync(position.coords);
  return {
    city: place?.city || place?.subregion || "",
    state: place?.region || "",
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
export async function getOccurrenceLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted")
    throw new Error("Localização não autorizada.");
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
}
