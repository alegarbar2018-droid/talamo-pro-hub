import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ExnessRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flow = searchParams.get('flow');

  useEffect(() => {
    if (flow === 'create') {
      import('@/lib/mockApi').then(({ getExnessCreateUrl }) => {
        window.location.href = getExnessCreateUrl();
      });
    } else if (flow === 'validate') {
      navigate('/auth/validate');
    } else {
      navigate('/');
    }
  }, [flow, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  );
}