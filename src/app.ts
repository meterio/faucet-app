import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import { getTapRules } from './const/rules';
import * as path from 'path';
class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    const { FAUCET_NETWORK } = process.env;
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();

    this.app.set('tap-rules', getTapRules(FAUCET_NETWORK));
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.set('view engine', 'ejs');
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(
      '/bootstrap',
      express.static(path.join(__dirname, '..', '/node_modules/bootstrap/dist'))
    );
    this.app.use(
      '/font-awesome',
      express.static(path.join(__dirname, '..', '/node_modules/font-awesome'))
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PWD, MONGO_PATH, MONGO_SSL_CA } = process.env;
    let url = `mongodb://${MONGO_USER}:${MONGO_PWD}@${MONGO_PATH}`;
    let options: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    let query: { [key: string]: string } = {};
    query['retryWrites'] = 'false';
    if (MONGO_SSL_CA != '') {
      const fs = require('fs');
      //Specify the Amazon DocumentDB cert
      var ca = [fs.readFileSync(MONGO_SSL_CA)];
      query['ssl'] = 'true';
      query['replicaSet'] = 'rs0';
      query['readPreference'] = 'secondaryPreferred';
      // url += '?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred';
      options = {
        ...options,
        sslValidate: true,
        sslCA: ca,
        useNewUrlParser: true,
      };
    }
    console.log('url: ', url);
    console.log('options: ', options);
    let queries = [];
    for (const key in query) {
      queries.push(`${key}=${query[key]}`);
    }
    let queryStr = queries.join('&');
    // mongoose.set("debug", true);
    mongoose.connect(queryStr ? url + '?' + queryStr : url, options);
  }
}

export default App;
