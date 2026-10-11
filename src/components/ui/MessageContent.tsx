import React from 'react';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

const MessageContent: React.FC<MessageContentProps> = ({ content, isUser }) => {
  // Si c'est un message utilisateur, affichage simple
  if (isUser) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  // Formatage des messages du bot avec markdown basique
  const formatMessage = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Titres avec **texte**
        if (line.includes('**') && line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={index} className="mb-2">
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={partIndex} className="font-semibold text-gray-900">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        }

        // Listes avec •
        if (line.trim().startsWith('•')) {
          return (
            <div key={index} className="flex gap-2 mb-1 ml-2">
              <span className="text-green-500 mt-1">•</span>
              <span className="flex-1">{line.trim().substring(1).trim()}</span>
            </div>
          );
        }

        // Lignes vides
        if (line.trim() === '') {
          return <div key={index} className="h-2"></div>;
        }

        // Lignes normales
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="space-y-1">
      {formatMessage(content)}
    </div>
  );
};

export default MessageContent; 