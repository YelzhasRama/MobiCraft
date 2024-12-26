# Используем подходящую версию Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости внутри контейнера
RUN npm install

# Копируем весь исходный код в контейнер
COPY . .

# Устанавливаем глобально Nest CLI (если требуется)
RUN npm install -g @nestjs/cli

# Сборка приложения
RUN npm run build

# Указываем порт для приложения
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "start"]
