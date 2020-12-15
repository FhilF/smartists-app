import axios from "axios";
const { COLLECTION } = require("radiks-server/app/lib/constants");
const sortBy = require("lodash/sortBy");

export const aggregateEntries = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "Entry",
    },
  };

  if (query.entryId) {
    match.$match._id = query.entryId;
  }

  if (query.dareId) {
    match.$match.dareId = query.dareId;
  }

  if (query.dareId && query.fetcher) {
    match.$match.dareId = query.dareId;
    match.$match.createdBy = {
      $ne: query.fetcher,
    };
  }

  if (query.dareId && query.createdBy) {
    match.$match.dareId = query.dareId;
    match.$match.createdBy = query.createdBy;
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
    $sort: { createdAt: -1 },
  };
  const limit = {
    $limit: query.limit || 10,
  };

  const dareLookup = {
    $lookup: {
      from: COLLECTION,
      localField: "dareId",
      foreignField: "_id",
      as: "dare",
    },
  };

  const userLookup = {
    $lookup: {
      from: COLLECTION,
      let: { durran_username: "$createdBy", radiks_type: "$radiksType" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["DurranUser", "$radiksType"] },
                { $eq: ["$$durran_username", "$username"] },
              ],
            },
          },
        },
      ],
      as: "durranUser",
    },
  };

  const pipeline = [match, sort, dareLookup, userLookup];

  let entries = await radiksData.aggregate(pipeline).toArray();

  if (!entries || !entries.length) {
    entries = [];
  }

  return entries;
};

export const aggregateOwnEntries = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: "Entry",
    },
  };

  if (query.dareId) {
    match.$match.dareId = query.dareId;
  }

  if (query.dareId && query.fetcher) {
    match.$match.dareId = query.dareId;
    match.$match.createdBy = {
      $ne: query.fetcher,
    };
  }

  if (query.dareId && query.createdBy) {
    match.$match.dareId = query.dareId;
    match.$match.createdBy = query.createdBy;
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
    $sort: { createdAt: -1 },
  };
  const limit = {
    $limit: query.limit || 10,
  };

  const dareLookup = {
    $lookup: {
      from: COLLECTION,
      localField: "dareId",
      foreignField: "_id",
      as: "dare",
    },
  };

  const pipeline = [match, sort, dareLookup];

  const entries = await radiksData.aggregate(pipeline).toArray();

  return entries;
};

export const fetchImages = async (_entries) => {
  const options = { decrypt: false };
  const entries = [..._entries];

  for (var i = 0; i < entries.length; i++) {
    const urlFiles = [];
    const _entry = {
      ...entries[i],
    };
    let res = await axios.get(entries[i].file);
    res.data.forEach((File, index) => {
      urlFiles.push(File);
    });
    _entry.userFiles = urlFiles;
    delete _entry.file;
    entries[i] = _entry;
  }

  return entries;
};

module.exports = {
  aggregateEntries,
  aggregateOwnEntries,
  fetchImages,
};
