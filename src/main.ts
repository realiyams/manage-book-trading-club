import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

import * as livereload from 'livereload';
import * as connectLiveReload from 'connect-livereload';

import flash = require('express-flash');

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(connectLiveReload());

  app.use(
    session({
      secret: 'supersecretsession',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(flash());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  await app.listen(3000);
}
bootstrap();
