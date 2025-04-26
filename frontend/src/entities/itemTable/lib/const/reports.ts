const columns = {
    items: [
        'Код',
        'Наименвоание',
        'Поставщик',
        'Был обновлен',
        'Последнее обновление'
    ],
    wbCommunications: [
        'Идентификатор товара',
        'Код клиента',
        'Товар/Комплект',
        'Цена',
        'Дата создания',
        'Дата обновления',
    ],
    ozonCommunications: [
        'Идентификатор товара',
        'Код клиента',
        'Товар/Комплект',
        'Цена',
        'Дата создания',
        'Дата обновления',
    ],
    stocksOfItem: [
        'Склад',
        'Остаток',
    ],
    wbRelations: [
        'Кабинет',
        'Код клиента',
        'Цена',
        'Дата',
    ],
    ozonRelations: [
        'Кабинет',
        'Код клиента',
        'Цена',
        'Дата',
    ],
    logs: [
        'Статус',
        'Сообщение',
        'Начало',
        'Конец',
    ],
}

export const reports = {
    items: columns.items,
    wbCommunications: columns.wbCommunications,
    ozonCommunications: columns.ozonCommunications,
    stocksOfItem: columns.stocksOfItem,
    wbRelations: columns.wbRelations,
    ozonRelations: columns.ozonRelations,
    logs: columns.logs,
}

export const titles = {
    items: 'Товары',
    ozonCommunications: 'Связи',
    wbCommunications: 'Связи',
    stocksOfItem: 'Остатки товара',
    wbRelations: 'Связи товара WB',
    ozonRelations: 'Связи товара Ozon',
    logs: 'Логи задачи',
}