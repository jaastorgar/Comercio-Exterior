
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, icon, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 duration-300 ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="text-secondary mr-4">{icon}</div>}
        <h3 className="text-xl font-bold text-primary">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default Card;
