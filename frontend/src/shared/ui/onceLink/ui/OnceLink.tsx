import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface LinkProps {
    path: string;
    children: React.ReactNode,
    className?: string; // Дополнительные стили из пропсов
}

export const OnceLink: React.FC<LinkProps> = React.memo(({ path, children, className }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Полный путь с параметрами
    const fullCurrentPath = `${pathname}?${searchParams.toString()}`;
    const fullTargetPath = `${path}?${searchParams.toString()}`;

    return fullCurrentPath === fullTargetPath ? (
        <span className={className}>{children}</span> // Если пути совпадают — рендерим <span>
    ) : (
        <Link href={fullTargetPath} className={className}>
            {children}
        </Link>
    );
});

OnceLink.displayName = "OnceLink";