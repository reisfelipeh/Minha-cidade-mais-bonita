import AsyncStorage from "@react-native-async-storage/async-storage";
import { CitySelection } from "../types";
const KEY = "@mcmp:city";
export async function loadCity(): Promise<CitySelection | null> {
  const value = await AsyncStorage.getItem(KEY);
  return value ? JSON.parse(value) : null;
}
export async function saveCity(city: CitySelection) {
  await AsyncStorage.setItem(KEY, JSON.stringify(city));
}
