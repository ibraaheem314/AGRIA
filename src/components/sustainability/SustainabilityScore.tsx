import React from 'react';
import { Leaf, Droplets, Sun, Wind } from 'lucide-react';
import Card from '../ui/Card';

interface ScoreProps {
  score: number;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const ScoreIndicator: React.FC<ScoreProps> = ({ score, category, icon, description }) => (
  <div className="flex items-start space-x-3">
    <div className="p-2 bg-primary/10 rounded-lg">
      {icon}
    </div>
    <div>
      <div className="flex items-center">
        <h3 className="font-semibold text-white">{category}</h3>
        <span className="ml-2 text-sm font-medium text-primary">{score}%</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
      <div className="mt-2 h-2 bg-neutral-700 rounded-full">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const SustainabilityScore = () => {
  const scores = [
    {
      category: 'Biodiversité',
      score: 85,
      icon: <Leaf className="w-5 h-5 text-green-400" />,
      description: 'Forte diversité des écosystèmes et préservation des habitats naturels.'
    },
    {
      category: 'Gestion de l’eau',
      score: 78,
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      description: 'Pratiques d’irrigation efficaces et conservation de l’eau.'
    },
    {
      category: 'Santé du sol',
      score: 92,
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      description: 'Excellente teneur en matière organique et bonne structure du sol.'
    },
    {
      category: 'Empreinte carbone',
      score: 73,
      icon: <Wind className="w-5 h-5 text-gray-400" />,
      description: 'Réduction des émissions grâce à des pratiques durables.'
    }
  ];

  const overallScore = Math.round(
    scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length
  );

  return (
    <Card className="p-6 bg-[#151818] border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Score de durabilité</h2>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{overallScore}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {scores.map((score) => (
          <ScoreIndicator key={score.category} {...score} />
        ))}
      </div>

      <div className="mt-6 p-4 border border-green-900 bg-green-950/40 rounded-lg">
        <h3 className="font-semibold text-green-300 mb-2">Recommandations</h3>
        <ul className="space-y-2 text-sm text-green-400">
          <li>• Implantez des cultures de couverture pour enrichir le sol</li>
          <li>• Installez des systèmes de récupération d’eau de pluie</li>
          <li>• Diversifiez les cultures dans vos rotations</li>
          <li>• Adoptez des pratiques de non-labour</li>
        </ul>
      </div>
    </Card>
  );
};

export default SustainabilityScore;
