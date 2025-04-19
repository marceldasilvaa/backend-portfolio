const userAdminGuard = (req, res, next) => {
  const reqId = req.user._id;

  const adminId = process.env.ADMIN_ID;

  if (reqId.toString() !== adminId) {
    return res.status(401).json({
      errors: ["Acesso negado!"],
    });
  }

  next();
};

module.exports = userAdminGuard;
