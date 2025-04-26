import React from "react";

interface AdaptiveTextProps {
    clamp: number;
    width: string;
    height: string;
    children: React.ReactNode;
    className?: string,
}

export const AdaptiveText: React.FC<AdaptiveTextProps> = ({ className, clamp, width, height, children }) => {
    return (
        <div
            className={`${className} min-w-[80px] break-words hyphens-auto overflow-hidden`}
            style={{ maxWidth: width, height, display: "-webkit-box", WebkitLineClamp: clamp, WebkitBoxOrient: "vertical" }}
        >
            {children}
        </div>
    );
};

