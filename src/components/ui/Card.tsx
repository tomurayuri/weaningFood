import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false
}: CardProps) => {
  const variantClasses = {
    default: 'bg-white shadow-sm border border-gray-200',
    outlined: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-md border border-gray-100'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  };

  const hoverClass = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200' : '';

  return (
    <div className={`
      rounded-lg 
      ${variantClasses[variant]} 
      ${paddingClasses[padding]} 
      ${hoverClass}
      ${className}
    `}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = ({ children, className = '', as: Component = 'h2' }: CardTitleProps) => (
  <Component className={`text-lg md:text-xl font-semibold text-gray-800 ${className}`}>
    {children}
  </Component>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={`text-gray-700 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
export default Card;