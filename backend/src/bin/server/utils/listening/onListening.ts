// Обработчик событий для успешного прослушивания
import createDebugMessages from 'debug';

export const debug = createDebugMessages('authentification-basics:server');

export function onListening(server: any) {
  const addr = server.address(); // Получаем адрес сервера
  const bind =
    typeof addr === 'string'
      ? 'pipe ' + addr // Если это сокет
      : 'port ' + addr.port; // Если это TCP-порт

  debug('Listening on ' + bind); // Выводим сообщение об отладке
}
