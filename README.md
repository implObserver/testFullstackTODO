# TODO List Management System  

## Тестовое задание - система управления задачами  

### Веб-приложение для управления персональными и командными задачами  

#### Страница авторизации:  
`![Auth Screenshot](https://github.com/user-attachments/assets/auth-screenshot.png)`  
*Вход в систему по логину и паролю с валидацией данных*  

#### Основной интерфейс задач:  
`![Tasks Screenshot](https://github.com/user-attachments/assets/tasks-screenshot.png)`  
*Гибкое отображение задач с возможностью группировки и сортировки*  

#### Модальное окно редактирования задачи:  
`![Edit Modal](https://github.com/user-attachments/assets/edit-modal.png)`  
*Полноценное редактирование всех атрибутов задачи*  

#### Просмотр задач подчиненных (режим руководителя):  
`![Manager View](https://github.com/user-attachments/assets/manager-view.png)`  
*Контроль задач сотрудников с иерархическим доступом*  

### Ключевые особенности:  
- **Гибкая система отображения задач** с тремя режимами группировки  
- **Визуальное выделение статусов**:  
  - 🔴 Просроченные задачи  
  - 🟢 Выполненные задачи  
  - ⚪ Активные задачи  
- **Полноценная система прав доступа** на основе организационной иерархии  
- **Безопасное хранение паролей** с использованием bcrypt  

## Технологический стек  

### BackEnd:
[![My Skills](https://skillicons.dev/icons?i=nodejs,express,postgresql,prisma)](https://skillicons.dev)
### FrontEnd
[![My Skills](https://skillicons.dev/icons?i=nextjs,react,redux)](https://skillicons.dev) (toolkit,persist, rtk query)

### Архитектура:
## FSD (Feature-Sliced Design)
## JWT аутентификация (access/refresh tokens, http-only cookies)
## REST API