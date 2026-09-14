import { decode } from "base64-arraybuffer";
import { UrbanOccurrence } from "../types";
import { supabase } from "./supabase";
const TIMEOUT = 20000;
function withTimeout<T>(operation: PromiseLike<T>, message: string) {
  return Promise.race([
    Promise.resolve(operation),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), TIMEOUT),
    ),
  ]);
}
function mime(extension: string) {
  const value = extension.toLowerCase();
  if (value === "jpg" || value === "jpeg") return "image/jpeg";
  if (value === "png") return "image/png";
  throw new Error("Formato de imagem não suportado.");
}
export async function listOccurrences(
  city: string,
  state: string,
  resolved: boolean,
) {
  const query = supabase
    .from("occurrences")
    .select("*, occurrence_updates(*)")
    .eq("city", city)
    .eq("state", state)
    .order("updated_at", { ascending: false });
  const { data, error } = resolved
    ? await query.eq("status", "RESOLVIDO")
    : await query.neq("status", "RESOLVIDO");
  if (error) throw error;
  return (data ?? []) as UrbanOccurrence[];
}
export async function createOccurrence(
  input: Omit<
    UrbanOccurrence,
    | "id"
    | "created_at"
    | "updated_at"
    | "photo_url"
    | "photo_path"
    | "author_name"
  >,
  base64: string,
  extension: string,
  onProgress: (message: string) => void,
) {
  onProgress("Validando sua conta...");
  const user = (
    await withTimeout(supabase.auth.getUser(), "A validação demorou demais.")
  ).data.user;
  if (!user) throw new Error("Entre novamente para publicar.");
  const ext = extension.toLowerCase();
  const path = `${user.id}/${Date.now()}.${ext}`;
  onProgress("Enviando a fotografia...");
  const upload = await withTimeout(
    supabase.storage
      .from("occurrence-photos")
      .upload(path, decode(base64), { contentType: mime(ext), upsert: false }),
    "O upload excedeu 20 segundos.",
  );
  if (upload.error) throw upload.error;
  const photo_url = supabase.storage
    .from("occurrence-photos")
    .getPublicUrl(path).data.publicUrl;
  try {
    onProgress("Registrando a ocorrência...");
    const result = await withTimeout(
      supabase
        .from("occurrences")
        .insert({ ...input, author_id: user.id, photo_path: path, photo_url })
        .select()
        .single(),
      "O registro excedeu 20 segundos.",
    );
    if (result.error) throw result.error;
    const occurrence = result.data as UrbanOccurrence;
    onProgress("Criando o histórico inicial...");
    const history = await withTimeout(
      supabase
        .from("occurrence_updates")
        .insert({
          occurrence_id: occurrence.id,
          author_id: user.id,
          type: "CRIADO",
          note: "Relato publicado.",
        }),
      "O histórico excedeu 20 segundos.",
    );
    if (history.error) throw history.error;
    return occurrence;
  } catch (error) {
    await supabase.storage.from("occurrence-photos").remove([path]);
    throw error;
  }
}
export async function updateOccurrenceStatus(
  id: string,
  status: UrbanOccurrence["status"],
  note: string,
) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Entre novamente.");
  const history = await supabase
    .from("occurrence_updates")
    .insert({ occurrence_id: id, author_id: user.id, type: status, note });
  if (history.error) throw history.error;
  const result = await supabase
    .from("occurrences")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (result.error) throw result.error;
  return result.data as UrbanOccurrence;
}
