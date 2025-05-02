import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface ArticleCardProps {
  title: string;
  category: string;
  summary: string;
  readTime: string;
  date: string;
  image: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  category,
  summary,
  readTime,
  date,
  image
}) => {
  return (
    <Card className="overflow-hidden bg-[#151818] border border-neutral-800">
      <div className="h-40 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <Badge variant="info" className="mb-2">{category}</Badge>
        <h3 className="text-lg font-semibold text-white line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-400 mt-2 line-clamp-3">{summary}</p>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {readTime}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {date}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
