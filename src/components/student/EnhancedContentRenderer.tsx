import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FlipCard, ContentAccordion, ContentTabs, Callout } from './InteractiveContent';
import { TradingSimulator } from './TradingSimulator';
import { TradingSimulatorV2 } from './TradingSimulatorV2';
import { parseExtendedMarkdown } from '@/lib/extended-markdown-parser';

interface EnhancedContentRendererProps {
  content: string;
}

export const EnhancedContentRenderer: React.FC<EnhancedContentRendererProps> = ({ content }) => {
  const h2Counter = React.useRef(0);
  const [parseError, setParseError] = React.useState<string | null>(null);
  
  // Reset counter on each render
  React.useEffect(() => {
    h2Counter.current = 0;
    setParseError(null);
  }, [content]);
  
  const parseContent = (markdown: string) => {
    try {
      let keyCounter = 0;

      // Parser mejorado que maneja anidación mediante conteo de niveles
      const parseNestedBlocks = (content: string): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        let i = 0;

        while (i < content.length) {
          // Buscar inicio de bloque
          const blockStartMatch = content.slice(i).match(/^:::(meta|step|accordion|tabs|flipcard|callout|trading-sim)([^\n]*)\n/m);
          
          if (!blockStartMatch) {
            // No hay más bloques, procesar el resto como markdown normal
            const remaining = content.slice(i);
            if (remaining.trim()) {
              elements.push(
                <div key={`md-${keyCounter++}`} className="prose prose-sm max-w-none dark:prose-invert break-words overflow-hidden">
                  <ReactMarkdown
                    components={{
                      h2: ({ children, ...props }) => {
                        const id = `topic-h2-${h2Counter.current++}`;
                        return (
                          <h2 id={id} data-topic-id={id} {...props}>
                            {children}
                          </h2>
                        );
                      },
                    }}
                  >
                    {remaining}
                  </ReactMarkdown>
                </div>
              );
            }
            break;
          }

          // Agregar contenido antes del bloque
          if (blockStartMatch.index! > 0) {
            const beforeContent = content.slice(i, i + blockStartMatch.index!);
            if (beforeContent.trim()) {
              elements.push(
                <div key={`md-${keyCounter++}`} className="prose prose-sm max-w-none dark:prose-invert break-words overflow-hidden">
                  <ReactMarkdown
                    components={{
                      h2: ({ children, ...props }) => {
                        const id = `topic-h2-${h2Counter.current++}`;
                        return (
                          <h2 id={id} data-topic-id={id} {...props}>
                            {children}
                          </h2>
                        );
                      },
                    }}
                  >
                    {beforeContent}
                  </ReactMarkdown>
                </div>
              );
            }
          }

          const blockType = blockStartMatch[1];
          const attributes = blockStartMatch[2];
          const blockHeaderLength = blockStartMatch[0].length;
          
          // Encontrar el cierre del bloque contando niveles de anidación
          let nestLevel = 1;
          let searchIndex = i + blockStartMatch.index! + blockHeaderLength;
          let blockEndIndex = -1;

          while (searchIndex < content.length && nestLevel > 0) {
            const nextOpening = content.slice(searchIndex).search(/^:::(meta|step|accordion|tabs|flipcard|callout|trading-sim)/m);
            const nextClosing = content.slice(searchIndex).search(/^\s*:::\s*$/m);

            if (nextClosing === -1) {
              // No hay cierre, tomar hasta el final
              blockEndIndex = content.length;
              break;
            }

            if (nextOpening !== -1 && nextOpening < nextClosing) {
              // Hay un bloque anidado
              nestLevel++;
              searchIndex += nextOpening + 3; // avanzar después de :::
            } else {
              // Encontramos un cierre
              nestLevel--;
              if (nestLevel === 0) {
                blockEndIndex = searchIndex + nextClosing;
                break;
              }
              searchIndex += nextClosing + 3; // avanzar después de :::
            }
          }

          if (blockEndIndex === -1) {
            blockEndIndex = content.length;
          }

          const blockContent = content.slice(i + blockStartMatch.index! + blockHeaderLength, blockEndIndex).trim();

          // Renderizar el bloque
          try {
            switch (blockType) {
              case 'meta':
              case 'step':
                // Meta and step blocks are parsed but not rendered here
                break;
              case 'accordion':
                elements.push(renderAccordion(blockContent, keyCounter++));
                break;
              case 'tabs':
                elements.push(renderTabs(blockContent, keyCounter++));
                break;
              case 'flipcard':
                elements.push(renderFlipCard(blockContent, keyCounter++));
                break;
              case 'callout':
                elements.push(renderCallout(attributes, blockContent, keyCounter++));
                break;
              case 'trading-sim':
                const versionMatch = attributes.match(/v="(\d+)"/);
                const version = versionMatch?.[1];
                if (version === '2') {
                  elements.push(renderTradingSimulatorV2(attributes, blockContent, keyCounter++));
                } else {
                  elements.push(renderTradingSimulator(attributes, blockContent, keyCounter++));
                }
                break;
            }
          } catch (error) {
            console.error(`Error rendering ${blockType}:`, error);
          }

          // Avanzar el índice después del bloque (incluyendo el cierre :::)
          const closingMatch = content.slice(blockEndIndex).match(/^\s*:::\s*/);
          i = blockEndIndex + (closingMatch ? closingMatch[0].length : 0);
        }

        return elements;
      };

      const elements = parseNestedBlocks(markdown);
      
      if (elements.length === 0) {
        h2Counter.current = 0;
        return [
          <div key="md-default" className="prose prose-sm max-w-none dark:prose-invert break-words overflow-hidden">
            <ReactMarkdown
              components={{
                h2: ({ children, ...props }) => {
                  const id = `topic-h2-${h2Counter.current++}`;
                  return (
                    <h2 id={id} data-topic-id={id} {...props}>
                      {children}
                    </h2>
                  );
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ];
      }

      return elements;
    } catch (error) {
      console.error('Error parsing markdown content:', error);
      setParseError(error instanceof Error ? error.message : 'Unknown parsing error');
      return [
        <div key="parse-error" className="p-6 border border-red-500/50 rounded-lg bg-red-500/10">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Content Parsing Error</h3>
          <p className="text-sm text-red-300 mb-4">
            This lesson content contains formatting errors and cannot be displayed correctly.
          </p>
          <details className="text-xs text-red-200">
            <summary className="cursor-pointer hover:text-red-100">Technical details</summary>
            <pre className="mt-2 p-2 bg-black/30 rounded overflow-auto max-h-40">
              {parseError || String(error)}
            </pre>
          </details>
          <p className="text-sm text-muted-foreground mt-4">
            Please contact an administrator to fix this lesson content.
          </p>
        </div>
      ];
    }
  };

  const renderAccordion = (content: string, key: number) => {
    // Limpiar cualquier ::: extra que pueda existir en el contenido
    const cleanedContent = content.replace(/^\s*:::\s*$/gm, '').trim();
    
    // Parse headers (##) as accordion items
    const sections = cleanedContent.split(/(?=^## )/gm).filter(Boolean);
    const items = sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].replace(/^##\s*/, '').trim();
      const rest = lines.slice(1).join('\n').trim();
      
      return {
        title,
        content: (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{rest}</ReactMarkdown>
          </div>
        )
      };
    }).filter(item => item.title); // Filter out empty items

    if (items.length === 0) return null;

    return <ContentAccordion key={`accordion-${key}`} items={items} />;
  };

  const renderTabs = (content: string, key: number) => {
    // Parse [label="..."] as tabs, limpiando cualquier ::: extra que pueda existir
    const cleanedContent = content.replace(/^\s*:::\s*$/gm, '').trim();
    const tabRegex = /\[label="([^"]+)"\]\s*([\s\S]*?)(?=\[label=|$)/g;
    const items: any[] = [];
    let tabMatch;
    
    while ((tabMatch = tabRegex.exec(cleanedContent)) !== null) {
      // Limpiar contenido de cada tab de posibles ::: residuales
      const tabContent = tabMatch[2].trim().replace(/^\s*:::\s*$/gm, '').trim();
      
      items.push({
        label: tabMatch[1].trim(),
        content: (
          <div className="prose prose-sm dark:prose-invert">
            <ReactMarkdown>{tabContent}</ReactMarkdown>
          </div>
        )
      });
    }

    if (items.length === 0) return null;

    return <ContentTabs key={`tabs-${key}`} items={items} />;
  };

  const renderFlipCard = (content: string, key: number) => {
    // Parse [front] and [back] sections
    const parts = content.split(/\[(front|back)\]/i);
    
    let frontContent = '';
    let backContent = '';
    
    for (let i = 1; i < parts.length; i += 2) {
      const section = parts[i].toLowerCase();
      const sectionContent = parts[i + 1]?.trim() || '';
      
      if (section === 'front') {
        frontContent = sectionContent;
      } else if (section === 'back') {
        backContent = sectionContent;
      }
    }

    if (!frontContent && !backContent) return null;

    return (
      <FlipCard
        key={`flipcard-${key}`}
        front={<ReactMarkdown>{frontContent || 'Click to flip'}</ReactMarkdown>}
        back={<ReactMarkdown>{backContent || 'Back side'}</ReactMarkdown>}
      />
    );
  };

  const renderCallout = (attributes: string, content: string, key: number) => {
    const typeMatch = attributes.match(/type="(\w+)"/);
    const type = (typeMatch?.[1] as 'info' | 'warning' | 'success' | 'danger') || 'info';

    return (
      <Callout key={`callout-${key}`} type={type}>
        <ReactMarkdown>{content.trim()}</ReactMarkdown>
      </Callout>
    );
  };

  const renderTradingSimulatorV2 = (attributes: string, content: string, key: number) => {
    try {
      const parsed = parseExtendedMarkdown(`:::trading-sim ${attributes}\n${content}\n:::`);
      const simBlock = parsed.blocks.find(b => b.type === 'trading-sim');
      if (!simBlock || simBlock.type !== 'trading-sim') {
        throw new Error('Failed to parse trading-sim block');
      }
      
      // Validate hints before rendering
      if (simBlock.props.hints && !Array.isArray(simBlock.props.hints)) {
        console.warn('TradingSimulatorV2: Invalid hints format, expected array', simBlock.props.hints);
        simBlock.props.hints = [];
      }
      
      return <TradingSimulatorV2 key={key} {...simBlock.props} />;
    } catch (error) {
      console.error('Error parsing Trading Simulator v2:', error);
      return (
        <div key={key} className="p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
          <p className="font-semibold text-red-400 mb-2">⚠️ Trading Simulator Error</p>
          <p className="text-sm text-red-300 mb-2">Failed to load this interactive trading scenario.</p>
          <details className="text-xs text-red-200">
            <summary className="cursor-pointer hover:text-red-100">Technical details</summary>
            <pre className="mt-2 p-2 bg-black/30 rounded overflow-auto text-xs">
{error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        </div>
      );
    }
  };

  const renderTradingSimulator = (attributes: string, content: string, key: number) => {
    try {
      // Extract asset and scenario from attributes
      const assetMatch = attributes.match(/asset="([^"]+)"/);
      const scenarioMatch = attributes.match(/scenario="([^"]+)"/);
      
      const asset = assetMatch?.[1] || 'Asset';
      const scenario = scenarioMatch?.[1] || 'scenario';

      // Extract sections using regex
      const educationalContextMatch = content.match(/\[educational_context\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const scenarioDataMatch = content.match(/\[scenario_data\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const annotationsMatch = content.match(/\[annotations\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const questionMatch = content.match(/\[question\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const feedbackBuyMatch = content.match(/\[feedback_buy\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const feedbackSellMatch = content.match(/\[feedback_sell\]\s*\n([\s\S]*?)(?=\n\[|$)/);
      const feedbackSkipMatch = content.match(/\[feedback_skip\]\s*\n([\s\S]*?)(?=\n\[|$)/);

      // Parse JSON sections
      const scenarioDataStr = scenarioDataMatch?.[1]?.trim() || '{}';
      const scenarioData = JSON.parse(scenarioDataStr);

      let educationalContext;
      if (educationalContextMatch?.[1]) {
        const educationalContextStr = educationalContextMatch[1].trim();
        educationalContext = JSON.parse(educationalContextStr);
      }

      let annotations;
      if (annotationsMatch?.[1]) {
        const annotationsStr = annotationsMatch[1].trim();
        annotations = JSON.parse(annotationsStr);
      }

      const question = questionMatch?.[1]?.trim() || 'What would you do?';
      const feedbackBuy = feedbackBuyMatch?.[1]?.trim() || 'You chose to buy.';
      const feedbackSell = feedbackSellMatch?.[1]?.trim() || 'You chose to sell.';
      const feedbackSkip = feedbackSkipMatch?.[1]?.trim() || 'You chose to skip.';

      return (
        <TradingSimulator
          key={`trading-sim-${key}`}
          asset={asset}
          scenario={scenario}
          scenarioData={scenarioData}
          question={question}
          feedbackBuy={feedbackBuy}
          feedbackSell={feedbackSell}
          feedbackSkip={feedbackSkip}
          educationalContext={educationalContext}
          annotations={annotations}
        />
      );
    } catch (error) {
      console.error('Error parsing trading-sim block:', error);
      // Fallback to showing raw content
      return (
        <div key={`trading-sim-error-${key}`} className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive font-semibold">Error loading trading simulator</p>
          <pre className="text-xs mt-2 overflow-x-auto">{content}</pre>
        </div>
      );
    }
  };

  return <div className="space-y-4">{parseContent(content)}</div>;
};
