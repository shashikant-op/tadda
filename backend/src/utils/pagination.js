const getPagination = (query) => {
  const page = parseInt(query.page, 10) > 0 ? parseInt(query.page, 10) : 1;
  const requestedLimit = parseInt(query.limit, 10) > 0 ? parseInt(query.limit, 10) : 10;
  const limit = Math.min(requestedLimit, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationResult = (total, page, limit, data) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

module.exports = { getPagination, getPaginationResult };
