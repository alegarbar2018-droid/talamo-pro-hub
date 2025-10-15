import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, Smartphone, Globe } from "lucide-react";

export function FundingInstructionsCard() {
  const { t } = useTranslation();

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {t("copy.funding.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {t("copy.funding.description")}
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="app">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>{t("copy.funding.option1.title")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  {t("copy.funding.option1.description")}
                </p>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">1.</span>
                    <span>{t("copy.funding.option1.step1")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">2.</span>
                    <span>{t("copy.funding.option1.step2")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">3.</span>
                    <span>{t("copy.funding.option1.step3")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">4.</span>
                    <span>{t("copy.funding.option1.step4")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">5.</span>
                    <span>{t("copy.funding.option1.step5")}</span>
                  </li>
                </ol>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                  <p className="font-medium mb-1">{t("copy.funding.note")}</p>
                  <p className="text-muted-foreground">{t("copy.funding.min_deposit")}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="web">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>{t("copy.funding.option2.title")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  {t("copy.funding.option2.description")}
                </p>
                
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">1.</span>
                    <span>{t("copy.funding.option2.step1")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">2.</span>
                    <span>{t("copy.funding.option2.step2")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">3.</span>
                    <span>{t("copy.funding.option2.step3")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">4.</span>
                    <span>{t("copy.funding.option2.step4")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">5.</span>
                    <span>{t("copy.funding.option2.step5")}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">6.</span>
                    <span>{t("copy.funding.option2.step6")}</span>
                  </li>
                </ol>

                <Button 
                  className="w-full gap-2"
                  onClick={() => window.open('https://my.exness.com', '_blank')}
                >
                  {t("copy.funding.go_to_exness")}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
