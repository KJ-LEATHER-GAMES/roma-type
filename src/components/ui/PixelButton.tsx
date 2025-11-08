import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    rounded?: boolean;
};

export function PixelButton({ rounded = true, className, ...rest }: Props) {
    return (
        <button
            {...rest}
            className={[
                'pixel-button',
                rounded ? 'pixel-button--rounded' : 'pixel-button--square',
                'pixel-font-tight',
                className ?? '',
            ]
                .join(' ')
                .trim()}
        />
    );
}
