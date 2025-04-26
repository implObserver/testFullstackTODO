'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { PaginationButton } from "../components/paginationButton";
import { PaginationInput } from "../components/paginationInput";

interface PaginationProps {
    totalPages: number;
    page_key: string;
    className?: string,
}

export const PaginationPanel: React.FC<PaginationProps> = ({ className, totalPages, page_key }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const sectionPageKey = `page_${page_key.replace("/", "_")}`;
    const page = Number(searchParams.get(sectionPageKey)) || 1;

    const [value, setValue] = useState(page);

    // Мемоизируем функцию setPage
    const setPage = useCallback((newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(sectionPageKey, newPage.toString());
        router.replace(`${pathname}?${params.toString()}`);
    }, [searchParams, sectionPageKey, pathname, router]);

    const debouncedSetPage = useDebouncedCallback(
        (newPage) => setPage(newPage),
        300
    );

    const validate = useCallback((newPage: number) => {
        if (isNaN(newPage) || newPage < 1) {
            return 1;
        }
        if (newPage > totalPages) {
            return totalPages;
        }
        return newPage;
    }, [totalPages]);

    const next = useCallback(() => {
        const validated = validate(page + 1);
        setValue(validated);
        setPage(validated);
    }, [page, validate, setPage]);

    const prev = useCallback(() => {
        const validated = validate(page - 1);
        setValue(validated);
        setPage(validated);
    }, [page, validate, setPage]);

    // Синхронизация value с page
    useEffect(() => {
        if (value !== page) {
            setValue(page);
        }
    }, [page, value]);

    // Проверка на выход за пределы totalPages
    useEffect(() => {
        if (page > totalPages) {
            setValue(totalPages);
            setPage(totalPages);
        }
    }, [totalPages, page, setPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(e.target.value);
        const validatedPage = validate(inputValue);
        setValue(validatedPage);
        debouncedSetPage(validatedPage);
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex items-center gap-2 flex-wrap ${className}`}>
            <PaginationButton
                onClick={prev}
                disabled={page === 1}
                label="Назад"
            />
            <div className="flex items-center">
                <PaginationInput
                    value={value}
                    onChange={handleInputChange}
                    onSubmit={() => debouncedSetPage.flush()}
                    max={totalPages}
                    min={1}
                />
                <span className="text-lg px-2">из {totalPages}</span>
            </div>
            <PaginationButton
                onClick={next}
                disabled={page === totalPages}
                label="Вперед"
            />
        </div>
    );
};