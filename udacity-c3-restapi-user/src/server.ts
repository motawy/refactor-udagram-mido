import express from 'express';
import { sequelize } from './sequelize';
import { IndexRouter } from './controllers/v0/index.router';
import bodyParser from 'body-parser';
import { config } from './config/config';
import { V0MODELS } from './controllers/v0/model.index';

const c = config.dev;

(async () => {
  sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  // Enable CORS
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "x-requested-with, content-type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "1000000000");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get("/", async (req, res) => {
    res.send("/api/v0/");
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running 8080`);
    console.log(`press CTRL+C to stop server`);
  });
})();