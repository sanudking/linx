import React from 'react';
import { classNames } from '../../utils/helpers';

const Card = ({ children, className = '', hover = false, glass = true, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'rounded-2xl transition-all duration-300',
        glass
          ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl'
          : 'bg-gray-900 border border-gray-800',
        hover && 'hover:border-primary-500/40 hover:shadow-primary-500/10 hover:shadow-2xl cursor-pointer hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
