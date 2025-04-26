import { FullTask } from "#/services/lib";
import { cn } from "#/services/lib/helpers/shadcn/lib/utils";

interface DeadLineMarkerProps {
    task: FullTask;
}

export const DeadLineMarker: React.FC<DeadLineMarkerProps> = ({ task }) => {
    const date = task.dueDate.toString().slice(0, 10);
    const status = task.status;

    const parseDate = (dateString: string) => {
        const separators = ['-', '.', '/'];

        for (const sep of separators) {
            const parts = dateString.split(sep);
            if (parts.length === 3) {
                const isYearFirst = parts[0].length === 4;
                const [year, month, day] = isYearFirst
                    ? [parts[0], parts[1], parts[2]]
                    : [parts[2], parts[1], parts[0]];

                const parsedDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day)
                );

                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }
        }
        return null;
    };

    const deadlineDate = parseDate(date);
    const currentDate = new Date();

    if (!deadlineDate) {
        return (
            <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                {date} (некорректный формат)
            </div>
        );
    }

    const isExpired = deadlineDate < currentDate;
    const formattedDate = deadlineDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Определяем цвет в зависимости от статуса и просроченности
    const getStatusColor = () => {
        if (isExpired) return "text-red-800 dark:bg-red-900 dark:text-red-200";
        if (status === "DONE") return "text-green-600 dark:text-green-400";
        return "text-gray-600 dark:text-gray-400";
    };

    return (
        <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium",
            getStatusColor()
        )}>
            <span>{formattedDate}</span>
            {isExpired && (
                <span className="ml-2 text-xs">(Просрочено)</span>
            )}
        </div>
    );
};