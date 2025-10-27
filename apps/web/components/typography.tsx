import React from 'react'

// Heading Components
export const H1 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h1 className={`text-h1 lg:text-[2.25rem] leading-tight font-semibold text-text-primary tracking-tight ${className}`}>
    {children}
  </h1>
)

export const H2 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h2 className={`text-h2 lg:text-[1.875rem] font-semibold text-text-primary tracking-tighter ${className}`}>
    {children}
  </h2>
)

export const H3 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`text-h3 font-semibold text-text-primary/90 ${className}`}>
    {children}
  </h3>
)

export const H4 = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <h4 className={`text-h4 font-medium text-text-primary/90 ${className}`}>
    {children}
  </h4>
)

// Body / Prose
export const P = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-body text-text-secondary leading-relaxed ${className}`}>
    {children}
  </p>
)

export const Muted = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-ui text-text-muted ${className}`}>
    {children}
  </p>
)

// Forms
export const Label = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <label className={`block text-ui font-medium text-text-secondary ${className}`}>
    {children}
  </label>
)

export const Help = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-caption text-text-muted mt-1 ${className}`}>
    {children}
  </p>
)

// Captions
export const Caption = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-caption text-text-muted ${className}`}>
    {children}
  </span>
)

// Code
export const Code = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <code className={`font-mono text-ui text-text-primary/90 tracking-tight ${className}`}>
    {children}
  </code>
)

// Gradients
export const GradientText = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <span className={`gradient-text ${className}`}>
    {children}
  </span>
)

