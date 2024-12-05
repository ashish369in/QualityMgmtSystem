import React from 'react';
import { motion } from 'framer-motion';

interface TrainingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  isCompleted?: boolean;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  title,
  description,
  icon,
  onClick,
  isCompleted = false,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={`
        relative p-6 rounded-lg shadow-md cursor-pointer
        ${isCompleted ? 'bg-green-50 border border-green-200' : 'bg-white hover:bg-gray-50'}
        transition-colors duration-200
      `}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <span className="flex items-center text-green-600">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Completed</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
