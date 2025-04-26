import { Input } from "#/services/lib";

interface PaginationInputProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    max: number;
    min: number;
}

export const PaginationInput: React.FC<PaginationInputProps> = ({ value, onChange, onSubmit, max, min }) => {
    return (
        <Input
            type='number'
            value={value}
            className="w-16 !text-[calc(var(--responsive-size)*2)] h-[calc(var(--responsive-size)*4)] text-center appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:m-0 
            [&::-webkit-outer-spin-button]:m-0
            [-moz-appearance:textfield]"
            onChange={onChange}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            onBlur={onSubmit}
            min={min}
            max={max}
        />
    );
};