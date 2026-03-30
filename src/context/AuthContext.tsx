"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAnonymous: boolean;
  isLoading: boolean;
};

// Creamos el contexto con valores por defecto
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAnonymous: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const handleSession = (session: Session | null) => {
    const user = session?.user ?? null;

    // detectar si es anónimo
    const isAnonymous = user?.is_anonymous ?? false;

    setSession(session);

    // SOLO guardas usuario si NO es anónimo
    setUser(!isAnonymous ? user : null);

    setIsLoading(false);

    return isAnonymous;
  };

  useEffect(() => {
    // 1. Obtener la sesión actual al cargar
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      handleSession(session);
    };

    getSession();

    // 2. Escuchar cambios (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ user, session, isAnonymous: !user && !!session, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
