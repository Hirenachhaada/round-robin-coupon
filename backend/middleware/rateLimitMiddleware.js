const rateLimit = require("express-rate-limit");

const couponLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes cooldown
  max: 1, // Limit each IP to 1 request per window
  message: { message: "Too many requests. Try again later." },
});

module.exports = { couponLimiter };
