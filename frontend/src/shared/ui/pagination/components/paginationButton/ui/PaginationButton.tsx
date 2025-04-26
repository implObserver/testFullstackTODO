import { Button } from "#/services/lib";

interface PaginationButtonProps {
    onClick: () => void;
    disabled: boolean;
    label: string;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({ onClick, disabled, label }) => {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className="w-[calc(var(--responsive-size)*10)] h-[calc(var(--responsive-size)*4)]"
            disabled={disabled}>
            {label}
        </Button>
    );
};