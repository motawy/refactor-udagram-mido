import express from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import { config } from './config/config';
import { V0MODELS } from './controllers/v0/model.index';
import cors from 'cors'

const c = config.dev;

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();
  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  let allowedOrigins = 'http://localhost:8100'
  app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
      console.log("ORIGIN: "+ origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins !== origin) {
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      }
      return callback(null, true);
    }
  }));

  app.use(bodyParser.json());
  app.use('/api/v0/', IndexRouter)
  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running ` + c.url);
    console.log(`press CTRL+C to stop server`);
  });
})();