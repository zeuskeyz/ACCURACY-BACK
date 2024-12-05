// middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (req.session.user && roles.includes(req.session.user.role)) {
        next();
      } else res.status(403).json({ message: 'Not authorized' });
    };
  };
  
  module.exports = roleMiddleware;