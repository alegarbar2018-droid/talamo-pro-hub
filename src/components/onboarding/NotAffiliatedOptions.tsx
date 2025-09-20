import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MessageSquare, Copy } from "lucide-react";
import { PARTNER_LINK } from "@/lib/constants";

interface NotAffiliatedOptionsProps {
  onCreateAccount: () => void;
  onRequestPartnerChange: () => void;
  onRetryValidation: () => void;
}

export const NotAffiliatedOptions = ({ onCreateAccount, onRequestPartnerChange, onRetryValidation }: NotAffiliatedOptionsProps) => {
  const handleCreateAccount = async () => {
    try {
      // Open partner link in new tab
      window.open(PARTNER_LINK, '_blank', 'noopener,noreferrer');
      onCreateAccount();
    } catch (error) {
      console.error('Error opening partner link:', error);
    }
  };

  return (
    <div id="block-b-not-affiliated" className="space-y-6 p-4 border-4 border-red-500 bg-red-100" style={{
      border: '4px solid red',
      backgroundColor: 'yellow',
      padding: '20px',
      margin: '20px 0'
    }}>
      <h2 style={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>
        🚨 OPCIONES NO AFILIADO - DEBUG 🚨
      </h2>
      
      <div style={{ backgroundColor: 'white', padding: '15px', border: '2px solid black' }}>
        <h3 style={{ color: 'black', fontSize: '18px' }}>
          Tu email no está afiliado con Tálamo
        </h3>
        <p style={{ color: 'black', marginTop: '10px' }}>
          Tienes dos opciones para acceder a la academia:
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Opción 1: Crear cuenta nueva */}
        <div style={{ backgroundColor: 'lightblue', padding: '15px', border: '2px solid blue' }}>
          <h4 style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>
            ✨ Crear cuenta nueva
          </h4>
          <p style={{ color: 'black', margin: '10px 0' }}>
            Mismos datos personales, email distinto.
          </p>
          <button 
            onClick={handleCreateAccount}
            style={{ 
              backgroundColor: 'blue', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Crear cuenta nueva
          </button>
        </div>

        {/* Opción 2: Solicitar cambio de partner */}
        <div style={{ backgroundColor: 'lightgreen', padding: '15px', border: '2px solid green' }}>
          <h4 style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>
            🔄 Solicitar cambio de partner
          </h4>
          <p style={{ color: 'black', margin: '10px 0' }}>
            Si ya tienes cuenta en Exness, puedes cambiarte a Tálamo.
          </p>
          <button 
            onClick={onRequestPartnerChange}
            style={{ 
              backgroundColor: 'green', 
              color: 'white', 
              padding: '10px 20px', 
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Solicitar cambio de partner
          </button>
        </div>
      </div>

      {/* Retry button */}
      <div style={{ textAlign: 'center', paddingTop: '15px' }}>
        <button
          onClick={onRetryValidation}
          style={{ 
            backgroundColor: 'orange', 
            color: 'black', 
            padding: '10px 20px', 
            border: '2px solid black',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🔄 Volver a validar
        </button>
      </div>
    </div>
  );
};