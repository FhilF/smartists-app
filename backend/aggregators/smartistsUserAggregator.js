const { COLLECTION } = require("radiks-server/app/lib/constants");
const sortBy = require("lodash/sortBy");

export const aggregateSmartistsUser = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "SmartistsUser",
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

  if (query.smartistsUser) {
    match.$match.username = query.smartistsUser;
  }

  const sort = {
    $sort: { createdAt: -1 },
  };

  const limit = {
    $limit: query.limit || 10,
  };

  const entryLookup = {
    $lookup: {
      from: COLLECTION,
      let: { durran_User: "$username" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["Entry", "$radiksType"] },
                { $eq: ["$$durran_User", "$createdBy"] },
              ],
            },
          },
        },
        {
          $lookup: {
            from: COLLECTION,
            localField: "dareId",
            foreignField: "_id",
            as: "dare",
          },
        },
      ],
      as: "entries",
    },
  };

  const pipeline = [match, sort];

  const user = await radiksData.aggregate(pipeline).toArray();

  return user;
};

module.exports = {
  aggregateSmartistsUser,
};
