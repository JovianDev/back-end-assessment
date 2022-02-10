export const pingController = {};

pingController.ping = (req, res, next) => {
  res.locals.ping = {
    success: true,
  };
  return next();
};
