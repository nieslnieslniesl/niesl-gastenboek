import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-full transition-all transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] border-2 border-black";
  
  const variants = {
    primary: "bg-gradient-to-b from-cyan-300 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-600",
    secondary: "bg-gradient-to-b from-yellow-300 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-600",
    danger: "bg-gradient-to-b from-red-400 to-red-700 text-white hover:from-red-500 hover:to-red-800",
    success: "bg-gradient-to-b from-lime-300 to-green-600 text-black hover:from-lime-400 hover:to-green-700"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-4 text-xl tracking-widest uppercase"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
