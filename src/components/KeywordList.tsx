// src/components/KeywordList.tsx - Placeholder Component
import React from 'react';

interface KeywordListProps {
  keywords: string[];
}

const KeywordList: React.FC<KeywordListProps> = ({ keywords }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800 mt-4">
      {keywords.map((keyword, index) => (
        <div key={index} className="bg-gray-100 p-2 rounded text-sm text-center">
          {keyword}
        </div>
      ))}
    </div>
  );
};

export default KeywordList;
