import moment from "moment";
import {
  aggregateSmartistsUser
} from "./aggregators/smartistsUserAggregator";
import { smartistsUserModifier } from "./modifier/smartistsUserModifier";

const express = require("express");
const request = require("request-promise");
const { decorateApp } = require("@awaitjs/express");
const { COLLECTION } = require("radiks-server/app/lib/constants");
const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);

  Router.getAsync("/smartists-user", async (req, res) => {
    let smartistsUser = await aggregateSmartistsUser(radiksData, req.query);
    smartistsUser = smartistsUserModifier(smartistsUser);
    res.json({ smartistsUser });
  });

  return Router;
};

module.exports = makeApiController;
