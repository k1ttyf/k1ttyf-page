# k1ttyf-lastfm

Прокси к last.fm для окошка «Listening now». Ключ хранится в секретах воркера, на сайт он не попадает.

Адрес: `https://api.k1ttyf.xyz/lastfm/now-playing`

## Установка

Нужны Node.js 18+, аккаунт Cloudflare с доменом `k1ttyf.xyz` и [API key last.fm](https://www.last.fm/api/account/create).

```sh
cd worker
npx wrangler login
npx wrangler deploy
npx wrangler secret put LASTFM_KEY
```

`deploy` сам создаст `api.k1ttyf.xyz`, сертификат выпускается пару минут. Потом откройте адрес выше: должен прийти JSON с `"playing"`.

## Настройки

- Ник last.fm: `LASTFM_USER` в `wrangler.toml`.
- Сайты, которым разрешены запросы: `ALLOWED_ORIGINS` в `src/index.js`.

После правок снова `npx wrangler deploy`. Сменить ключ: `npx wrangler secret put LASTFM_KEY`, деплой не нужен.

## Локально

Создайте `worker/.dev.vars` со строкой `LASTFM_KEY=ваш_ключ` и запустите `npx wrangler dev` (порт 8787).
Чтобы сайт брал данные отсюда, поменяйте `ENDPOINT` в `assets/js/lastfm.js`.

## Если не работает

- `{"error":"upstream"}`: неверный ключ или last.fm не ответил. Логи: `npx wrangler tail`.
- Адрес не открывается после деплоя: подождите сертификат. Если в DNS уже была запись `api`, удалите её и задеплойте снова.
- Ошибка CORS: сайт открыт с адреса, которого нет в `ALLOWED_ORIGINS`.
