import { cn, getInitials, avatarColor } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
};

export function Avatar({ src, name, size = 'md', online, className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = avatarColor(name);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover', sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white',
            sizeMap[size],
            colorClass
          )}
        >
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-[#161b27]',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            online ? 'bg-green-400' : 'bg-gray-500'
          )}
        />
      )}
    </div>
  );
}
