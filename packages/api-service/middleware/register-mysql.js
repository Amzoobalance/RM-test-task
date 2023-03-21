const registerMySql = (client) => async (req, res, next) => {
  await client.$on();
  req.db = client;
  next();
};

module.exports = {
  registerMySql,
};
