# TODO List Management System  

## Тестовое задание - система управления задачами  

### Полнофункциональное веб-приложение для управления персональными и командными задачами  

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

### Backend:  
```bash
[![Node.js](https://skillicons.dev/icons?i=nodejs)]
[![Express](https://skillicons.dev/icons?i=express)] 
[![PostgreSQL](https://skillicons.dev/icons?i=postgresql)]
[![Prisma](https://skillicons.dev/icons?i=prisma)]

### Frontend:
```bash
[![React](https://skillicons.dev/icons?i=react)]
[![Redux](https://skillicons.dev/icons?i=redux)] (Toolkit, Persist)
[![TypeScript](https://skillicons.dev/icons?i=typescript)]

### Архитектура:
##FSD (Feature-Sliced Design)
##JWT аутентификация (access/refresh tokens, http-only cookies)
##REST API