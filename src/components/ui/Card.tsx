import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  bordered?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  bordered = true,
  hover = false,
  className,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/50
        ${bordered ? 'border border-gray-200/80 shadow-sm' : ''}
        ${hover ? 'hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer' : ''}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';

// Card subcomponents
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => (
  <div className={`p-5 border-b border-gray-100 ${className || ''}`} {...props}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...props }) => (
  <div className={`p-5 ${className || ''}`} {...props}>
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => (
  <div className={`p-5 border-t border-gray-100 flex items-center justify-between ${className || ''}`} {...props}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';