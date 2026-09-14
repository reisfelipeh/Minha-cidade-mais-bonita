export type ScreenName =
  | "WELCOME"
  | "CITY"
  | "HOME"
  | "AUTH"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "REPORT"
  | "ACTIVE"
  | "RESOLVED"
  | "DETAIL"
  | "ACCOUNT"
  | "TERMS"
  | "PRIVACY";
export type AuthMode = "LOGIN" | "SIGNUP";
export type Category =
  | "Via pública"
  | "Iluminação"
  | "Água ou esgoto"
  | "Limpeza urbana"
  | "Sinalização"
  | "Calçada ou acessibilidade"
  | "Vegetação"
  | "Equipamento público"
  | "Outro";
export type OccurrenceStatus =
  | "ATIVO"
  | "AINDA_PRESENTE"
  | "RESOLUCAO_INFORMADA"
  | "RESOLVIDO";
export interface CitySelection {
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  source: "GPS" | "MANUAL";
  confirmedAt: string;
}
export interface OccurrenceUpdate {
  id: string;
  occurrence_id: string;
  author_id: string | null;
  type: "CRIADO" | Exclude<OccurrenceStatus, "ATIVO">;
  note: string;
  created_at: string;
}
export interface UrbanOccurrence {
  id: string;
  author_id: string | null;
  author_name: string;
  title: string;
  category: Category;
  description: string;
  reference: string;
  attention: "Normal" | "Requer atenção" | "Aparenta risco";
  photo_url: string;
  photo_path: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  sensor_magnitude: number;
  capture_condition: "Estável" | "Com movimento";
  status: OccurrenceStatus;
  created_at: string;
  updated_at: string;
  occurrence_updates?: OccurrenceUpdate[];
}
