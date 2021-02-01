const { COLLECTION } = require("radiks-server/app/lib/constants");
const sortBy = require("lodash/sortBy");

export const aggregatePortfolio = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "Portfolio",
    },
  };

  if (query.lt) {
    match.$match.createdAt = {
      $lt: parseInt(query.lt, 10),
    };
  }

  if (query.gte) {
    match.$match.createdAt = {
      $gte: query.gte,
    };
  }

  if (query.studioId) {
    match.$match.studioId = query.studioId;
  }

  const sort = {
    $sort: { createdAt: -1 },
  };

  const limit = {
    $limit: query.limit || 10,
  };

  let pipeline = [match, sort];

  const user = await radiksData.aggregate(pipeline).toArray();

  return user;
};

module.exports = {
  aggregatePortfolio,
};
