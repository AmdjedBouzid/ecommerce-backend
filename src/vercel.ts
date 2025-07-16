// src/vercel.ts
import { createApp } from './main';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const expressApp = express();

let cachedApp: any;

async function setup() {
  if (!cachedApp) {
    const app = await createApp();
    const adapter = new ExpressAdapter(expressApp);
    app.use(adapter);
    await app.init();
    cachedApp = expressApp;
  }

  return cachedApp;
}

export default async (req, res) => {
  const app = await setup();
  return app(req, res);
};
