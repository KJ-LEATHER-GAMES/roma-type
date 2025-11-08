import React from 'react';

type Props = React.PropsWithChildren<{
    /** true: 角丸, false: 角張り */
    rounded?: boolean;
    /** レンダリング要素（div, section, article, など） */
    as?: React.ElementType;
    className?: string;
    style?: React.CSSProperties;
}>;

export function PixelPanel({ children, rounded = true, as, className, style, ...rest }: Props) {
    const Comp: React.ElementType = as ?? 'div';

    return (
        <Comp
            {...rest}
            className={[
                'pixel-outline',
                rounded ? 'pixel-outline--rounded' : 'pixel-outline--square',
                'pixel-font-tight',
                className ?? '',
            ]
                .join(' ')
                .trim()}
            style={{
                padding: 12,
                background: 'var(--panel)',
                color: 'var(--fg)',
                ...(style ?? {}),
            }}
        >
            {children}
        </Comp>
    );
}
