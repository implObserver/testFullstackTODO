
import { useTabsContext } from "#/shared/lib";
import { AdaptiveText } from "#/shared/ui/adaptiveText";
import { OnceLink } from "#/shared/ui/onceLink";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
interface Tabprops {
    tabPath: string,
    children?: ReactNode,
    styles?: string,
}
export const BaseTab: React.FC<Tabprops> = ({ children, tabPath }) => {
    const context = useTabsContext();
    const pathname = usePathname();

    // Определяем активен ли таб по текущему урлу
    const isActive = tabPath === '' ? pathname.endsWith(`${context.path}`) : pathname.includes(`${context.path}/${tabPath}`);
    const className = context.tabSettings.className;
    const tabClassName = typeof className === "function"
        ? className(isActive) // если передали функцию, вызываем с булеаном
        : className;
    return (
        <>
            <OnceLink
                path={`${context.path}/${tabPath}`}>
                <AdaptiveText
                    className={`${tabClassName} ${context.textSettings.className}`}
                    width={context.textSettings.width ?? ''}
                    height={context.textSettings.height ?? ''}
                    clamp={context.textSettings.clamp ?? -1}
                >
                    {children}
                </AdaptiveText>
            </OnceLink>
        </>
    )
}