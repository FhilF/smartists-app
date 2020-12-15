const { COLLECTION } = require("radiks-server/app/lib/constants");
const sortBy = require("lodash/sortBy");

export const aggregateDares = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "Dare",
    },
  };

  if (query.dareId) {
    match.$match._id = query.dareId;
  }

  if (query.date) {
    match.$match.dateTimeStart = {
      $lte: parseInt(query.date),
    };
    match.$match.dateTimeEnd = {
      $gte: parseInt(query.date),
    };
  }

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

  if (query.createdBy) {
    match.$match.createdBy = query.createdBy;
  }

  const sort = {
    $sort: { dateTimeStart: -1, dateTimeEnd: -1, createdAt: -1 },
  };

  const limit = {
    $limit: query.limit || 10,
  };

  const pipeline = [match, sort];

  const dares = await radiksData.aggregate(pipeline).toArray();

  return dares;
};

export const aggregateDaresAdmin = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "Dare",
    },
  };

  if (query.date) {
    match.$match.dateTimeStart = {
      $lte: parseInt(query.date),
    };
    match.$match.dateTimeEnd = {
      $gte: parseInt(query.date),
    };
  }

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

  if (query.createdBy) {
    match.$match.createdBy = query.createdBy;
  }

  let sort = {
    $sort: { createdAt: -1 },
  };

  const limit = {
    $limit: query.limit || 10,
  };

  const entryLookup = {
    $lookup: {
      from: COLLECTION,
      let: { dare_id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["Entry", "$radiksType"] },
                { $eq: ["$$dare_id", "$dareId"] },
              ],
            },
          },
        },
      ],
      as: "entries",
    },
  };

  const pipeline = [match, sort, entryLookup];

  const dares = await radiksData.aggregate(pipeline).toArray();

  return dares;
};

const transformMessageVotes = (_messages, username) => {
  const messages = [..._messages];
  messages.forEach((message, index) => {
    const _message = {
      ...message,
    };
    _message.hasVoted = false;
    if (username) {
      message.votes.forEach((vote) => {
        if (vote.username === username) {
          _message.hasVoted = true;
        }
      });
    }
    messages[index] = _message;
  });
  return messages;
};

const handleStatus = (dateStart, dateEnd, moment) => {
  if (dateStart < moment() && dateEnd > moment()) {
    return "active";
  }
  if (dateEnd < moment()) {
    return "finished";
  }
  return "pending";
};
export const fixDaresAdmin = (_dares, moment) => {
  const dares = [..._dares];
  dares.forEach((dare, index) => {
    const _dare = {
      ...dare,
    };
    _dare.entryCount = _dare.entries.length;
    _dare.status = handleStatus(_dare.dateTimeStart, _dare.dateTimeEnd, moment);
    delete _dare.entries;
    dares[index] = _dare;
  });
  return dares;
};

module.exports = {
  aggregateDares,
  aggregateDaresAdmin,
  fixDaresAdmin,
};
