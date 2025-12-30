const jwt = require("jsonwebtoken");

function studentAuth(req, res, next) {
  const token = req.cookies.token;

  // No token → not logged in
  if (!token) {
    return res.redirect("/student-login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // store admin info if needed
    next();
  } catch (error) {
    // Invalid or expired token
    res.clearCookie("token");
    return res.redirect("/student-login");
  }
}

module.exports = studentAuth;
