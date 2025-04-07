export default function pagination(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size
    const skip = (page - 1) * pageSize;

    const results = {};

    try {
      results.total = await model.countDocuments().exec();
      results.results = await model
        .find(req.filter)
        .skip(skip)
        .limit(pageSize)
        .exec();

      results.pages = Math.ceil(results.total / pageSize);
      results.currentPage = page;
      req.paginatedResults = results;
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server Error:" + err.message });
    }
  };
}
