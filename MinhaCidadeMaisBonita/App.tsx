import { useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { AccountScreen } from "./src/screens/AccountScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { CityScreen } from "./src/screens/CityScreen";
import { DetailScreen } from "./src/screens/DetailScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LegalDocumentScreen } from "./src/screens/LegalDocumentScreen";
import { OccurrenceListScreen } from "./src/screens/OccurrenceListScreen";
import { ReportScreen } from "./src/screens/ReportScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import {
  listOccurrences,
  updateOccurrenceStatus,
} from "./src/services/occurrences";
import { configured } from "./src/services/supabase";
import { loadCity, saveCity } from "./src/services/storage";
import { colors } from "./src/theme";
import {
  AuthMode,
  CitySelection,
  ScreenName,
  UrbanOccurrence,
} from "./src/types";
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <AuthProvider>
        <Application />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
function Application() {
  const {
    user,
    loading: authLoading,
    recoveryRequested,
    clearRecoveryRequest,
  } = useAuth();
  const [screen, setScreen] = useState<ScreenName>("WELCOME");
  const [authMode, setAuthMode] = useState<AuthMode>("LOGIN");
  const [city, setCity] = useState<CitySelection | null>(null);
  const [active, setActive] = useState<UrbanOccurrence[]>([]);
  const [resolved, setResolved] = useState<UrbanOccurrence[]>([]);
  const [selected, setSelected] = useState<UrbanOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnAfterAuth, setReturnAfterAuth] = useState<ScreenName>("HOME");
  useEffect(() => {
    loadCity().then((value) => {
      setCity(value);
      setLoading(false);
    });
  }, []);
  async function refresh(value = city) {
    if (!value || !configured) return;
    try {
      const [a, r] = await Promise.all([
        listOccurrences(value.city, value.state, false),
        listOccurrences(value.city, value.state, true),
      ]);
      setActive(a);
      setResolved(r);
    } catch (error) {
      Alert.alert(
        "Falha ao carregar",
        error instanceof Error ? error.message : "Erro inesperado",
      );
    }
  }
  useEffect(() => {
    void refresh();
  }, [city]);
  useEffect(() => {
    if (recoveryRequested) {
      setScreen("RESET_PASSWORD");
      clearRecoveryRequest();
    }
  }, [recoveryRequested]);
  function requireAuth(target: ScreenName) {
    if (user) return setScreen(target);
    setReturnAfterAuth(target);
    setAuthMode("LOGIN");
    setScreen("AUTH");
  }
  if (loading || authLoading)
    return (
      <SafeAreaView style={s.loading}>
        <Text style={s.white}>Preparando sua cidade...</Text>
      </SafeAreaView>
    );
  if (!configured)
    return (
      <SafeAreaView style={s.loading}>
        <Text style={s.white}>Supabase não configurado.</Text>
      </SafeAreaView>
    );
  return (
    <View style={s.app}>
      {screen === "WELCOME" && (
        <WelcomeScreen onContinue={() => setScreen(city ? "HOME" : "CITY")} />
      )}{" "}
      {screen === "CITY" && (
        <CityScreen
          initial={city}
          onBack={() => setScreen(city ? "HOME" : "WELCOME")}
          onConfirm={async (value) => {
            setCity(value);
            await saveCity(value);
            setScreen("HOME");
          }}
        />
      )}{" "}
      {screen === "HOME" && city && (
        <HomeScreen
          city={city}
          active={active.length}
          resolved={resolved.length}
          user={!!user}
          onChangeCity={() => setScreen("CITY")}
          onNavigate={setScreen}
          onAuth={() => setScreen(user ? "ACCOUNT" : "AUTH")}
        />
      )}{" "}
      {screen === "AUTH" && (
        <AuthScreen
          mode={authMode}
          onModeChange={setAuthMode}
          onBack={() => setScreen("HOME")}
          onSuccess={() => setScreen(returnAfterAuth)}
          onForgotPassword={() => setScreen("FORGOT_PASSWORD")}
          onOpenTerms={() => {
            setAuthMode("SIGNUP");
            setScreen("TERMS");
          }}
          onOpenPrivacy={() => {
            setAuthMode("SIGNUP");
            setScreen("PRIVACY");
          }}
        />
      )}{" "}
      {screen === "FORGOT_PASSWORD" && (
        <ForgotPasswordScreen onBack={() => setScreen("AUTH")} />
      )}{" "}
      {screen === "RESET_PASSWORD" && (
        <ResetPasswordScreen onFinished={() => setScreen("AUTH")} />
      )}{" "}
      {screen === "TERMS" && (
        <LegalDocumentScreen
          document="TERMS"
          onBack={() => {
            setAuthMode("SIGNUP");
            setScreen("AUTH");
          }}
        />
      )}{" "}
      {screen === "PRIVACY" && (
        <LegalDocumentScreen
          document="PRIVACY"
          onBack={() => {
            setAuthMode("SIGNUP");
            setScreen("AUTH");
          }}
        />
      )}{" "}
      {screen === "ACCOUNT" && (
        <AccountScreen
          onBack={() => setScreen("HOME")}
          onDeleted={() => setScreen("WELCOME")}
        />
      )}{" "}
      {screen === "REPORT" && city && (
        <ReportScreen
          city={city}
          onBack={() => setScreen("HOME")}
          onSaved={async () => {
            await refresh();
            setScreen("ACTIVE");
          }}
        />
      )}{" "}
      {screen === "ACTIVE" && (
        <OccurrenceListScreen
          title="Problemas ativos"
          items={active}
          onBack={() => setScreen("HOME")}
          onSelect={(item) => {
            setSelected(item);
            setScreen("DETAIL");
          }}
        />
      )}{" "}
      {screen === "RESOLVED" && (
        <OccurrenceListScreen
          title="Problemas resolvidos"
          items={resolved}
          resolved
          onBack={() => setScreen("HOME")}
          onSelect={(item) => {
            setSelected(item);
            setScreen("DETAIL");
          }}
        />
      )}{" "}
      {screen === "DETAIL" && selected && (
        <DetailScreen
          item={selected}
          authenticated={!!user}
          onBack={() =>
            setScreen(selected.status === "RESOLVIDO" ? "RESOLVED" : "ACTIVE")
          }
          onRequireAuth={() => requireAuth("DETAIL")}
          onUpdate={async (status, note) => {
            await updateOccurrenceStatus(selected.id, status, note);
            await refresh();
            setScreen(status === "RESOLVIDO" ? "RESOLVED" : "ACTIVE");
          }}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  app: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  white: { color: "#FFF", fontWeight: "800" },
});
