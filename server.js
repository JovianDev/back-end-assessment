import express from 'express';

//routes
import pingRoute from './routes/pingRoute.js';
import postsRoute from './routes/postsRoute.js';

export const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use((req, res, next) => {
  console.log('********************************');
  console.log('REQ METHOD ', req.method);
  console.log('REQ URL ', req.url);
  console.log('********************************');
  return next();
});

app.use('/api/ping', pingRoute);
app.use('/api/posts', postsRoute);

app.use((err, req, res, next) => {
  const defaultErr = {
    log: `Error handler caught a middleware error => ${err.message}`,
    status: 400,
    message: { error: `${err}` },
  };
  Object.assign(defaultErr, err);
  console.log(defaultErr.log);
  return res.status(defaultErr.status).json(defaultErr.message).end();
});
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
