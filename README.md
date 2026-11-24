This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Каталог и PostgreSQL

Для локального запуска нужны Node.js 22.13 или новее из поддерживаемых LTS-веток и отдельная база PostgreSQL для этого проекта. Укажи её адрес в файле `.env.local` в корне проекта:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@127.0.0.1:5432/DATABASE
```

Подставь имя пользователя, пароль, порт и имя созданной базы. Символы вроде `@`, `#` и `/` в пароле нужно экранировать по правилам URL. Файл `.env.local` игнорируется Git.

```bash
npm ci
npm run db:setup
npm run dev
```

`db:setup` создаёт таблицы и добавляет восемь демонстрационных позиций с русскими переводами из `db/seed-products-ru.json`. Повторный запуск не дублирует записи и сохраняет существующие товары и переводы. Для старой локальной базы достаточно снова выполнить `npm run db:setup`.

На первом визите сайт открывается на русском. Выбор **RU / EN** в шапке сохраняется в браузере. Адрес страницы и выбранные фильтры сохраняются при смене языка. Интерфейсные переводы хранятся в `src/lib/messages/`.

Если на этом компьютере уже настроена локальная копия PostgreSQL в `.local-postgres`, после перезагрузки компьютера её можно запустить из PowerShell в корне проекта:

```powershell
.\.local-postgres\pgsql\bin\pg_ctl.exe -D .local-postgres/data -l .local-postgres/server.log -o "-h 127.0.0.1 -p 55432" -w start
```

## Вход владельца

`npm run db:setup` также создаёт таблицы аккаунта и сессий. В установке магазина может быть один владелец. Учётная запись создаётся из интерактивного терминала, например в VS Code.

```powershell
npm run db:setup
npm run owner:create
```

Введи адрес почты владельца. Команда сгенерирует пароль и один раз покажет его в терминале. Сохрани пароль в менеджере паролей. Затем открой `/owner/login` или выбери «Кабинет владельца» внизу сайта.

Переменная `OWNER_AUTH_SECRET` должна содержать не менее 32 случайных символов. Для новой установки можно сгенерировать значение командой `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` и сохранить его в `.env.local` или в секретах хостинга. На локальном компьютере принимает вход только loopback-адрес. Для размещения сайта укажи в `OWNER_AUTH_URL` публичный HTTPS-адрес магазина, например `https://shop.example.com`.

## Команды запуска

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
