const cors = require("cors");

const allowedOrigins = ["http://localhost:5173"];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS policy: This origin is not allowed"));
  },
  credentials: true,
});

module.exports = corsMiddleware;