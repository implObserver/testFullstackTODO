interface StatusProps {
    status: string;
}

export const StatusContainer: React.FC<StatusProps> = ({ status }) => {
    // Определяем стили в зависимости от статуса
    const getStatusStyle = () => {
        switch (status.toLowerCase()) {
            case 'done':
                return '!p-2 bg-green-100 text-green-800';
            case 'in_progress':
                return '!p-2 bg-blue-100 text-blue-800';
            case 'todo':
                return '!p-2 bg-yellow-100 text-yellow-800';
            case 'canceled':
                return '!p-2 bg-red-100 text-red-800';
            default:
                return '!p-2 bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`inline-flex items-center px-3 py-1 rounded-[10px] text-sm font-medium ${getStatusStyle()}`}>
            {status}
        </div>
    );
};