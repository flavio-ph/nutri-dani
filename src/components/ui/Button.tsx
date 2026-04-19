import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface BaseProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  fullWidth?: boolean;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type ButtonAsAnchor = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  fullWidth = false,
  as = 'button',
  ...props
}: ButtonProps) {
  let baseStyles = "inline-flex items-center justify-center gap-2 transition-all";
  let variants = {};
  let sizes = {};

  if (variant === 'ghost') {
    variants = { ghost: "bg-transparent text-text hover:text-primary rounded-full font-medium" };
    sizes = { sm: "px-6 py-3 text-sm", md: "px-8 py-4 text-base", lg: "px-10 py-5 text-lg" };
  } else {
    baseStyles += " rounded-[4px] font-semibold tracking-[0.5px]";
    variants = {
      primary: "bg-primary hover:bg-primary-dark text-white",
      secondary: "bg-accent hover:bg-[#8D7658] text-white",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    };
    sizes = {
      sm: "px-6 py-3 text-[13px]",
      md: "px-[36px] py-[18px] text-[14px]",
      lg: "px-10 py-5 text-[15px]",
    };
  }

  const widthStyle = fullWidth ? "w-full" : "";
  const classes = `${baseStyles} ${(variants as any)[variant]} ${(sizes as any)[size]} ${widthStyle} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : (size === 'md' ? 18 : 20)} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : (size === 'md' ? 18 : 20)} />}
    </>
  );

  if (as === 'a') {
    return (
      <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
