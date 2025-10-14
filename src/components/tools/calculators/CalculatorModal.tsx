import { ReactNode, useEffect } from "react";
import { X, Share2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  calculatorId: string;
}

export function CalculatorModal({
  isOpen,
  onClose,
  children,
  calculatorId,
}: CalculatorModalProps) {
  const { toast } = useToast();

  // Update URL with query param when modal opens
  useEffect(() => {
    if (isOpen && calculatorId) {
      const url = new URL(window.location.href);
      url.searchParams.set('calc', calculatorId);
      window.history.pushState({}, '', url);
    } else if (!isOpen) {
      const url = new URL(window.location.href);
      url.searchParams.delete('calc');
      window.history.pushState({}, '', url);
    }
  }, [isOpen, calculatorId]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('calc')) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Calculadora de Trading',
          text: 'Mira esta calculadora profesional de trading',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Enlace copiado",
          description: "El enlace se ha copiado al portapapeles",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] md:h-[90vh] p-0 gap-0 bg-background border-line/50">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-4 border-b border-line/50 bg-surface/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted/50"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="hidden md:block w-px h-6 bg-line/50" />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-line/50 hover:bg-muted/50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
