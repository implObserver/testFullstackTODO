# TODO List Management System  

## Тестовое задание - система управления задачами  

### Веб-приложение для управления персональными и командными задачами  

#### Страница авторизации:  
![image](https://github.com/user-attachments/assets/21106bb0-0711-4b74-b7f2-54c215ef0201)
![image](https://github.com/user-attachments/assets/f8f92267-e858-4332-8a7b-9cc9a5a228f0)

*Вход в систему по логину и паролю с валидацией данных*  

#### Основной интерфейс задач:  
![image](https://github.com/user-attachments/assets/c8a1567c-7632-4296-a9bb-14cab2db2585)
*Гибкое отображение задач с возможностью группировки и сортировки*  

#### Модальное окно создания задачи:  
![image](https://github.com/user-attachments/assets/a4a9d791-9163-4e4e-88db-e0981ba119cf)

*Гибкое создание задач*  

#### Модальное окно редактирования задачи:  
![image](https://github.com/user-attachments/assets/40d266ed-6339-4f05-807a-90f643be0839)
*Полноценное редактирование всех атрибутов задачи*  

#### Просмотр задач подчиненных (режим руководителя):  
![image](https://github.com/user-attachments/assets/50039973-532e-4650-8ef5-0a64cdd9fe40)
 
*Контроль задач сотрудников с иерархическим доступом*  

#### Группировка задач по дедлайнам:  
![image](https://github.com/user-attachments/assets/3faa6049-5d3b-41b8-9b14-3fbe0287a875)

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
