# Используем подходящую версию Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev-зависимости)
RUN npm install

# Копируем исходный код
COPY . .

# Устанавливаем глобально Nest CLI, если требуется
RUN npm install -g @nestjs/cli

# Сборка приложения
RUN npm run build

# Указываем порт, который будет использоваться приложением
EXPOSE 3000

# Запуск приложения
CMD ["npm", "run", "start:prod"]
