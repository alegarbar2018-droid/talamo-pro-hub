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
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl"></div>
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
              <Card className="bg-surface/40 backdrop-blur-2xl border-red-500/20 shadow-xl p-8 h-full group hover:border-red-500/50 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-400 relative overflow-hidden">
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                
                <div className="flex flex-col items-center text-center gap-4 relative">
                  <div className="group-hover:scale-110 transition-transform duration-400 group-hover:animate-pulse">
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