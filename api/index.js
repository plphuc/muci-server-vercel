import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import { errorConverter, errorHandler } from './middlewares/handleError.js';
import bodyParser from 'body-parser';

const app = new express();

app.use(cors());
app.use(bodyParser.json());

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

app.get('/', function (req, res) {});

// convert error to ApiError
app.use(errorConverter);
// handle error
app.use(errorHandler);

app.listen(8080, () => console.log("Server ready on port 3000."));

export default app;