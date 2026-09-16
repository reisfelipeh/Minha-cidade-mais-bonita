import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../services/supabase";
interface Value {
  session: Session | null;
  user: User | null;
  loading: boolean;
  recoveryRequested: boolean;
  clearRecoveryRequest: () => void;
  signOut: () => Promise<void>;
}
const Context = createContext<Value>({
  session: null,
  user: null,
  loading: true,
  recoveryRequested: false,
  clearRecoveryRequest: () => undefined,
  signOut: async () => undefined,
});
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setRecoveryRequested(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <Context.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        recoveryRequested,
        clearRecoveryRequest: () => setRecoveryRequested(false),
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
