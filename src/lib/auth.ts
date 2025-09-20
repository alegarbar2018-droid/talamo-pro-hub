// Simple auth utilities for MVP
export interface User {
  id: string;
  name: string;
  email: string;
  isAffiliated: boolean;
}

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem("user");
  const isValidated = localStorage.getItem("isValidated");
  
  if (userData) {
    const user = JSON.parse(userData);
    return {
      ...user,
      isAffiliated: isValidated === 'true'
    };
  }
  
  return null;
};

export const setUserValidation = (validated: boolean) => {
  localStorage.setItem("isValidated", validated.toString());
  if (validated) {
    localStorage.setItem("partnerId", "1141465940423171000");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("isValidated");
  localStorage.removeItem("partnerId");
};

export const isUserValidated = (): boolean => {
  return localStorage.getItem("isValidated") === 'true';
};