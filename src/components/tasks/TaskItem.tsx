import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';

interface TaskItemProps {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  description,
  dueDate,
  priority,
  status
}) => {
  const getPriorityBadge = () => {
    if (priority === 'high') return <Badge variant="danger">Haute</Badge>;
    if (priority === 'medium') return <Badge variant="warning">Moyenne</Badge>;
    return <Badge variant="info">Basse</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
  };

  const isCompleted = status === 'completed';

  return (
    <div
      className={`p-4 rounded-lg border border-neutral-800 bg-[#151818] shadow-sm transition hover:border-primary`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`text-base font-medium ${
              isCompleted ? 'text-gray-500 line-through' : 'text-white'
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        {getPriorityBadge()}
      </div>

      <div className="mt-3 flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-500">
          <Clock size={14} className="mr-1" />
          {formatDate(dueDate)}
        </div>

        {isCompleted ? (
          <span className="flex items-center text-green-500">
            <CheckCircle size={14} className="mr-1" />
            Terminée
          </span>
        ) : (
          <button className="text-primary hover:underline flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Marquer comme faite
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
