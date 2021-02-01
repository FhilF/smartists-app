const { COLLECTION } = require("radiks-server/app/lib/constants");
const sortBy = require("lodash/sortBy");

export const aggregateSmartistsMember = async (radiksData, query) => {
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

  if (query.smartistsMember) {
    match.$match.username = query.smartistsMember;
  }

  const sort = {
    $sort: { createdAt: -1 },
  };

  const limit = {
    $limit: query.limit || 10,
  };

  const studioLookup = {
    $lookup: {
      from: COLLECTION,
      let: { smartists_Member: "$username", is_Artist: "$isArtist.boolean" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$$is_Artist", true] },
                { $eq: ["Studio", "$radiksType"] },
                { $eq: ["$$smartists_Member", "$username"] },
              ],
            },
          },
        },
      ],
      as: "studio",
    },
  };

  let pipeline = [];

  if (query.studioLookup) {
    pipeline = [match, sort, studioLookup];
  } else {
    pipeline = [match, sort];
  }

  const user = await radiksData.aggregate(pipeline).toArray();

  return user;
};

module.exports = {
  aggregateSmartistsMember,
};
