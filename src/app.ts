import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import { getTapRules } from './const/rules';
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
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(`${__dirname}/public`));
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
    if (MONGO_SSL_CA != '') {
      const fs = require('fs');
      //Specify the Amazon DocumentDB cert
      var ca = [fs.readFileSync(MONGO_SSL_CA)];
      url += '?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred';
      options = {
        ...options,
        sslValidate: true,
        sslCA: ca,
        useNewUrlParser: true,
      };
    }
    console.log('url: ', url);
    console.log('options: ', options);
    mongoose.connect(url, options);
  }
}

export default App;
