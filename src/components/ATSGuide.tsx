import React from 'react';
import { LucideIcon } from 'lucide-react'; // Assuming lucide-react for icons

interface FeatureCardProps {
  icon: LucideIcon; // Icon component from lucide-react
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700">
      <div className="text-blue-600 mb-4">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
