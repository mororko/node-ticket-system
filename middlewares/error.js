import logger from "../helper/logger.js";

export default function error(err, req, res, next) {
  // Log the error
  logger.error(err.message, { metadata: err });

  // Send a generic error response
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}
