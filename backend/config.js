const envList = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(originString => originString.trim())
    .filter(Boolean);

const defaultOrigins = [
  'https://geraldine-edwards-quote-generator-frontend.hosting.codeyourfuture.io',
  'http://localhost:5501',
  'http://127.0.0.1:5501'
];

export const allowedOrigins = envList.length ? envList : defaultOrigins;