import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export function useAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Solo para Sign Up

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Solo para Sign Up

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/tools/image-converter";

  const supabase = createClient();
  const { user, isAnonymous, isLoading: isAuthLoading } = useAuth();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Protección de ruta: Si ya está logueado, lo sacamos
  useEffect(() => {
    if (!isAuthLoading && user && !isAnonymous) {
      router.replace(redirectTo);
    }
  }, [user, isAnonymous, isAuthLoading, router, redirectTo]);

  // Usamos React.FormEvent<HTMLFormElement> para arreglar el warning
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message || "Failed to sign in. Please verify your credentials.");
      setIsLoading(false);
    } else {
      toast.success("Welcome back!");
      router.push(redirectTo);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 2) {
      toast.error("Please enter your full name (minimum 2 characters)");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: cleanName },
      },
    });

    if (error) {
      setError(error.message);
      toast.error(error.message || "Failed to create account. Please try again.");
      setIsLoading(false);
    } else {
      toast.success("Account created! Check your email to confirm your account.");
      setSuccess(true);
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    error,
    isLoading,
    success,
    handleLogin,
    handleSignup,
    redirectTo,
    isAuthLoading,
    user,
    isAnonymous,
  };
}
