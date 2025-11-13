// src/components/ui/PixelButton.tsx
import clsx from 'clsx';
import React from 'react';

type PixelButtonProps<T extends React.ElementType = 'button'> = {
    as?: T;
    className?: string;
    isActive?: boolean;
    children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export const PixelButton = <T extends React.ElementType = 'button'>(props: PixelButtonProps<T>) => {
    const { as, className, isActive = false, children, ...rest } = props;

    // ✅ キャスト不要版
    const Component: React.ElementType = as || 'button';

    const buttonSpecificProps =
        Component === 'button'
            ? ({ type: 'button' } as React.ComponentPropsWithoutRef<'button'>)
            : {};

    return (
        <Component
            {...buttonSpecificProps}
            {...rest}
            className={clsx(
                'pixel-outline pixel-rounded u-pad-s',
                'pixelated',
                'u-center',
                { 'u-flash': isActive },
                className,
            )}
        >
            {children}
        </Component>
    );
};
