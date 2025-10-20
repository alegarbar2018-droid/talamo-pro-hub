import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface LessonPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LessonPreviewModal({ open, onOpenChange }: LessonPreviewModalProps) {
  const { t } = useTranslation('academy');
  const navigate = useNavigate();

  const previewLesson = {
    title: "Seguridad y cuentas de trading",
    level: "Nivel 1: Fundamentos",
    duration: "25 min",
    format: "Video + Lectura",
    objectives: [
      "Entender la importancia de la seguridad en trading",
      "Configurar correctamente una cuenta de trading",
      "Conocer los tipos de cuentas disponibles",
      "Implementar medidas de protección básicas"
    ],
    preview: `
En esta lección introductoria, aprenderás los fundamentos esenciales de seguridad en trading y cómo configurar correctamente tu cuenta.

**¿Por qué es crucial la seguridad?**

El trading implica manejar capital real, y una configuración incorrecta puede resultar en pérdidas evitables. Esta lección te enseñará:

- Verificación de dos factores (2FA)
- Gestión segura de contraseñas
- Reconocimiento de plataformas legítimas vs. fraudes
- Configuración de límites de riesgo

**Tipos de cuentas de trading**

Existen diferentes tipos de cuentas según tu nivel de experiencia...
    `.trim(),
    locked: [
      "Ejercicios prácticos interactivos",
      "Checklist de seguridad descargable",
      "Quiz de evaluación",
      "Acceso a la comunidad privada"
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-background via-surface/95 to-background backdrop-blur-2xl border-2 border-primary/30 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <Badge className="bg-accent/20 border border-accent/40 text-accent-foreground mb-2">
                Vista Previa Gratuita
              </Badge>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {previewLesson.title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            {previewLesson.level}
          </DialogDescription>
        </DialogHeader>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 my-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{previewLesson.duration}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface/60 backdrop-blur-xl border border-primary/20 rounded-xl">
            <PlayCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{previewLesson.format}</span>
          </div>
        </div>

        {/* Objectives */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Objetivos de aprendizaje
          </h4>
          <ul className="space-y-2">
            {previewLesson.objectives.map((objective, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{objective}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Preview Content */}
        <div className="bg-surface/40 backdrop-blur-xl border-2 border-primary/20 rounded-2xl p-6 mb-6">
          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line">
            {previewLesson.preview}
          </div>
          
          {/* Blur overlay */}
          <div className="relative mt-4">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background backdrop-blur-md flex items-end justify-center pb-8 rounded-2xl">
              <Badge className="bg-primary/20 border border-primary/40 text-lg px-6 py-2">
                <Lock className="w-4 h-4 mr-2" />
                Contenido completo requiere registro
              </Badge>
            </div>
            <div className="opacity-30 blur-sm">
              <p className="text-muted-foreground mb-4">
                [Contenido adicional: explicación detallada de cada tipo de cuenta, ventajas y desventajas...]
              </p>
              <p className="text-muted-foreground">
                [Video tutorial: Configuración paso a paso de tu primera cuenta...]
              </p>
            </div>
          </div>
        </div>

        {/* Locked Content */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Desbloquea al registrarte:
          </h4>
          <ul className="space-y-2">
            {previewLesson.locked.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            onClick={() => {
              onOpenChange(false);
              navigate("/access?intent=academy");
            }}
            className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-14 text-lg rounded-xl transition-all duration-300 hover:scale-105"
          >
            Comenzar mi formación
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-2 border-primary/40 hover:bg-surface/60 h-14 rounded-xl transition-all duration-300"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
