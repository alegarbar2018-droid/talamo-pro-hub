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
    console.log("=== VALIDATE AFFILIATION FUNCTION CALLED ===", { email });
    
    if (loading || cooldownSeconds > 0) {
      console.log("Blocked by loading or cooldown", { loading, cooldownSeconds });
      return;
    }
    
    setLoading(true);
    setError("");
    setUserExists(false);

    try {
      console.log("Step 1: Check for demo mode");
      // Check for demo mode first (simplest check)
      if (email.toLowerCase().includes("demo") || email.toLowerCase().includes("exness")) {
        console.log("Demo mode detected, calling onDemo");
        onDemo();
        return;
      }
      
      console.log("Step 2: Not demo mode, calling onNotAffiliated for now");
      // For now, just call onNotAffiliated to see if the flow works
      onNotAffiliated();
      
    } catch (err: any) {
      console.error("Error in validateAffiliation:", err);
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      console.log("Setting loading to false");
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