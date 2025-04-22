// Функция для нормализации порта
export function normalizePort(val:any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // именованный канал
  }

  if (port >= 0) {
    return port; // номер порта
  }

  return false;
}
