import clsx from "clsx";

const baseTab = (active: boolean) =>
    clsx(
        `flex flex-shrink-0
        !mt-4
        bg-gray-25
        rounded-t-[10px]
        border-2
        gap-2
        cursor-pointer
        scroll-snap-align-start
        text-sm font-[600]
        items-center 
        content-center
        !p-2
        hover:border-b-gray-300 bg-gray-100 hover:text-gray-600 hover:bg-gray-200`,
        {
            "!border-b bg-gray-300": active, // Активное состояние (фиолетовый цвет)
            " text-gray-500": !active, // Обычное состояние
        }
    );

export const tabs = {
    baseTab,
}