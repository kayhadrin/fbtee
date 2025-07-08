import { Root } from '@radix-ui/react-separator';

import cx from '../lib/cx.tsx';
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react';

const Separator = forwardRef<
  ComponentRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(
  (
    { className, decorative = true, orientation = 'horizontal', ...props },
    ref,
  ) => (
    <Root
      className={cx(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      decorative={decorative}
      orientation={orientation}
      ref={ref}
      {...props}
    />
  ),
);
Separator.displayName = Root.displayName;

export { Separator };
