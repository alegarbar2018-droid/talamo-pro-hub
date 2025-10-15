/**
 * Agrega parámetros UTM a un URL para tracking
 * Fase 7: UTM Tracking
 */
export function addUTMParams(
  url: string,
  params: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  } = {}
): string {
  const {
    source = 'talamo',
    medium = 'copy',
    campaign = 'dir',
    term,
    content
  } = params;
  
  const utmParams = new URLSearchParams();
  
  utmParams.append('utm_source', source);
  utmParams.append('utm_medium', medium);
  utmParams.append('utm_campaign', campaign);
  
  if (term) utmParams.append('utm_term', term);
  if (content) utmParams.append('utm_content', content);
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${utmParams.toString()}`;
}

/**
 * Verifica si un URL ya tiene parámetros UTM
 */
export function hasUTMParams(url: string): boolean {
  return url.includes('utm_source=') || 
         url.includes('utm_medium=') || 
         url.includes('utm_campaign=');
}

/**
 * Extrae parámetros UTM de un URL
 */
export function extractUTMParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
    const value = urlObj.searchParams.get(key);
    if (value) params[key] = value;
  });
  
  return params;
}
