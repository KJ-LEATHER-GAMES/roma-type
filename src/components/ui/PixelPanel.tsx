import { clsx } from 'clsx';
import React from 'react';

type Props = {
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
};

export const PixelPanel: React.FC<Props> = ({ as: Tag = 'div', className, children }) => {
    return <Tag className={clsx('pixel-outline pixel-rounded u-pad-m', className)}>{children}</Tag>;
};
