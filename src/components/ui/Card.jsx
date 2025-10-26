import { cn } from '../../lib/utils';

const Card = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('flex flex-col space-y-1.5', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn('text-xl font-semibold leading-none tracking-tight line-clamp-1 py-1', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };