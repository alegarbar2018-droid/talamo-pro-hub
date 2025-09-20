import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Target, ArrowRight } from "lucide-react";

interface ProfileData {
  language: string;
  level: string;
  objective: string;
  riskTolerance: string;
  interests: string[];
}

interface ProfileStepProps {
  profile: ProfileData;
  onProfileUpdate: (profile: ProfileData) => void;
  onComplete: () => void;
}

export const ProfileStep = ({ profile, onProfileUpdate, onComplete }: ProfileStepProps) => {
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info(`profile_completed`, { profile });
    onComplete();
  };

  const updateProfile = (updates: Partial<ProfileData>) => {
    onProfileUpdate({ ...profile, ...updates });
  };

  const handleInterestChange = (asset: string, checked: boolean) => {
    if (checked) {
      updateProfile({ interests: [...profile.interests, asset] });
    } else {
      updateProfile({ interests: profile.interests.filter(i => i !== asset) });
    }
  };

  return (
    <Card className="border-line bg-surface shadow-glow-subtle">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Completar Perfil
        </CardTitle>
        <CardDescription>
          Personaliza tu experiencia en Tálamo según tus objetivos
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level" className="text-base font-medium">Nivel de experiencia</Label>
              <select
                id="level"
                value={profile.level}
                onChange={(e) => updateProfile({ level: e.target.value })}
                required
                className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
              >
                <option value="">Selecciona tu nivel</option>
                <option value="inicial">Inicial</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective" className="text-base font-medium">Objetivo principal</Label>
              <select
                id="objective"
                value={profile.objective}
                onChange={(e) => updateProfile({ objective: e.target.value })}
                required
                className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
              >
                <option value="">Selecciona tu objetivo</option>
                <option value="intraday">Trading intradía</option>
                <option value="swing">Swing trading</option>
                <option value="scalping">Scalping</option>
                <option value="mixed">Combinado</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskTolerance" className="text-base font-medium">Tolerancia al riesgo</Label>
            <select
              id="riskTolerance"
              value={profile.riskTolerance}
              onChange={(e) => updateProfile({ riskTolerance: e.target.value })}
              required
              className="w-full h-11 rounded-md border border-line bg-input px-3 py-2 text-sm"
            >
              <option value="">Selecciona tu tolerancia</option>
              <option value="conservador">Conservador (1-2% por operación)</option>
              <option value="moderado">Moderado (2-3% por operación)</option>
              <option value="agresivo">Agresivo (3-5% por operación)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Activos de interés (selecciona varios)</Label>
            <div className="grid grid-cols-2 gap-2">
              {['XAUUSD', 'EURUSD', 'GBPUSD', 'USOIL', 'US30', 'US500', 'BTCUSD', 'Crypto'].map((asset) => (
                <label key={asset} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.interests.includes(asset)}
                    onChange={(e) => handleInterestChange(asset, e.target.checked)}
                    className="rounded border-line"
                  />
                  <span className="text-sm">{asset}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!profile.level || !profile.objective || !profile.riskTolerance}
            className="w-full bg-gradient-primary hover:shadow-glow h-11"
          >
            Acceder a mi panel
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};