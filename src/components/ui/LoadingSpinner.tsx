/******************************************************************************
                            IMPORTS
******************************************************************************/
import React from 'react';

/******************************************************************************
                            INTERFACES
******************************************************************************/
interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    message?: string;
}

/******************************************************************************
                            COMPONENT
******************************************************************************/
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'lg',
    fullScreen = true,
    message = 'Loading Course...'
}) => {
/******************************************************************************
 *                               STYLES
******************************************************************************/
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex flex-col gap-4 items-center justify-center bg-coastal-dark-teal/50 backdrop-blur-sm z-50'
    : 'flex flex-col gap-4 items-center justify-center';

/******************************************************************************
   *                            RENDER
******************************************************************************/
    return (
        <div className={containerClasses}>
            <div className={`animate-spin rounded-full border-4 border-coastal-light-teal border-t-coastal-dark-teal ${sizeClasses[size]}`} />
            {message && (
                <p className="text-white font-medium text-lg">{message}</p>
            )}
        </div>
    );
}; 