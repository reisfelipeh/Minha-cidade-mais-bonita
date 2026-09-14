import { supabase } from "./supabase";
export async function requestPasswordRecovery(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: "minhacidadebonita://auth/reset-password" },
  );
  if (error) throw error;
}
export async function updateRecoveredPassword(password: string) {
  if (password.length < 8) throw new Error("Use pelo menos 8 caracteres.");
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
