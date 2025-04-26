const columns = {
    items: ['code', 'name', 'supplier_id', 'updated', 'created_at'],
    wbCommunications: ['nm_id', 'vendor_code', 'undefined', 'price', 'created_at', 'updated_at'],
    ozonCommunications: ['product_id', 'offer_id', 'undefined', 'price', 'created_at', 'updated_at'],
    stocksOfItem: ['warehouse_name', 'stock'],
    wbRelations: ['wb_market_name', 'vendor_code', 'price', 'updated_at'],
    ozonRelations: ['ozon_market_name', 'offer_id', 'price', 'updated_at'],
    logs: ['status', 'message', 'created_at', 'updated_at']
}

export const taskFields = {
    items: columns.items,
    wbCommunications: columns.wbCommunications,
    ozonCommunications: columns.ozonCommunications,
    stocksOfItem: columns.stocksOfItem,
    wbRelations: columns.wbRelations,
    ozonRelations: columns.ozonRelations,
    logs: columns.logs,
}