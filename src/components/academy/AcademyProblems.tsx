import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, Users, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AcademyProblems() {
  const { t } = useTranslation('academy');
  
  const problems = [
    {
      icon: <TrendingDown className="w-24 h-24 text-red-400" />,
      title: t('problems.problem1_title'),
      description: t('problems.problem1_desc')
    },
    {
      icon: <Users className="w-24 h-24 text-orange-400" />,
      title: t('problems.problem2_title'),
      description: t('problems.problem2_desc')
    },
    {
      icon: <DollarSign className="w-24 h-24 text-yellow-400" />,
      title: t('problems.problem3_title'),
      description: t('problems.problem3_desc')
    },
    {
      icon: <AlertTriangle className="w-24 h-24 text-red-500" />,
      title: t('problems.problem4_title'),
      description: t('problems.problem4_desc')
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-20 relative"
    >
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('problems.title')}
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('problems.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-surface/30 border-red-500/20 p-8 h-full group hover:border-red-500/40 hover:scale-105 transition-all duration-300">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="group-hover:scale-110 transition-transform">
                    {problem.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-2xl">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}