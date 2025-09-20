import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAffiliationValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [checkingUser, setCheckingUser] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const checkUserExists = async (email: string) => {
    setCheckingUser(true);
    try {
      // For GET requests, we need to pass query params differently
      const response = await fetch(`https://xogbavprnnbfamcjrsel.supabase.co/functions/v1/check-user-exists?email=${encodeURIComponent(email.trim().toLowerCase())}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ2JhdnBybm5iZmFtY2pyc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDM3ODQsImV4cCI6MjA3MzkxOTc4NH0.6l1XCkopeKxOPzj9vfYcslB-H-Q-w7F8tPLhGYu-rYw`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error("Error checking user existence:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("User exists check result:", data);
      return data?.exists === true;
    } catch (err) {
      console.error("Error in checkUserExists:", err);
      return false;
    } finally {
      setCheckingUser(false);
    }
  };

  const validateAffiliation = async (
    email: string,
    onSuccess: (uid?: string) => void,
    onNotAffiliated: () => void,
    onDemo: () => void,
    onUserExists?: () => void
  ) => {
    if (loading || cooldownSeconds > 0) return;
    
    setLoading(true);
    setError("");
    setUserExists(false);

    try {
      console.log("Starting validation process for:", email);
      
      // Check user existence first - independent operation
      const exists = await checkUserExists(email);
      setUserExists(exists);
      
      if (exists && onUserExists) {
        console.log("User already exists, showing login option");
        // Don't call onUserExists immediately, just set the state
        // The UI will show the login option
      }

      // Check for demo mode before calling API
      if (email.toLowerCase().includes("demo") || email.toLowerCase().includes("exness")) {
        console.log("Demo mode activated");
        onDemo();
        return;
      }
      
      // Validate affiliation with Exness - separate try/catch with timeout
      let affiliationData;
      try {
        console.log("Calling validate-affiliation function...");
        const { data, error: functionError } = await supabase.functions.invoke(
          "validate-affiliation",
          {
            body: { email: email.trim().toLowerCase() }
          }
        );

        if (functionError) {
          console.error("Function error:", functionError);
          setError("Error de conexión con el servidor");
          return;
        }

        affiliationData = data;
        console.log("Validation response:", affiliationData);
      } catch (affiliationError: any) {
        console.error("Affiliation validation error:", affiliationError);
        setError("Error al validar afiliación con el bróker");
        return;
      }

      // Handle demo mode
      if (affiliationData?.source === "demo-bypass") {
        console.log("Demo mode activated");
        onDemo();
        return;
      }

      // Handle successful affiliation
      if (affiliationData?.affiliation === true) {
        console.log("User is affiliated, calling onSuccess with uid:", affiliationData.client_uid);
        onSuccess(affiliationData.client_uid);
        return;
      }

      // Handle not affiliated
      if (affiliationData?.code === "NotAffiliated" || affiliationData?.affiliation === false) {
        console.log("User not affiliated");
        onNotAffiliated();
        return;
      }

      // Handle error responses with proper mapping
      if (affiliationData?.code) {
        const errorMessages: Record<string, string> = {
          "timeout": "El bróker tardó demasiado. Intenta de nuevo.",
          "rate_limited": "Demasiadas solicitudes. Espera un momento e intenta de nuevo.",
          "broker_down": "Servicio del bróker con incidencias. Intenta más tarde.",
          "unauthorized_broker": "No autenticado con el bróker. Reintenta en unos minutos.",
          "bad_broker_response": "Respuesta inválida del bróker. Contacta soporte.",
          "BadRequest": "Email inválido o faltan datos.",
          "ServerError": "Error interno del servidor"
        };
        
        const message = errorMessages[affiliationData.code] || affiliationData.message || "Error desconocido";
        setError(message);
        
        // Set cooldown for rate limiting
        if (affiliationData.code === "rate_limited") {
          setCooldownSeconds(60);
          const interval = setInterval(() => {
            setCooldownSeconds(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        setError("Respuesta inesperada del servidor");
      }

    } catch (err: any) {
      console.error("General validation error:", err);
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  const resetValidation = () => {
    setError("");
    setCooldownSeconds(0);
    setUserExists(false);
  };

  return {
    loading,
    error,
    cooldownSeconds,
    checkingUser,
    userExists,
    validateAffiliation,
    resetValidation
  };
};