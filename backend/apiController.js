import moment from "moment";
import {
  aggregateSmartistsMember
} from "./aggregators/smartistsMemberAggregator";
import {
  aggregatePortfolio
} from "./aggregators/portfolioAggregator";
import {
  aggregateProject
} from "./aggregators/projectAggregator";
import { smartistsMemberModifier } from "./modifier/smartistsMemberModifier";
import { portfolioModifier } from "./modifier/portfolioModifier";
import { projectModifier } from "./modifier/projectModifier";

const express = require("express");
const request = require("request-promise");
const { decorateApp } = require("@awaitjs/express");
const { COLLECTION } = require("radiks-server/app/lib/constants");
const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);

  Router.getAsync("/smartists-user", async (req, res) => {
    let smartistsUser = await aggregateSmartistsMember(radiksData, req.query);
    smartistsUser = smartistsMemberModifier(smartistsUser);
    res.json({ smartistsUser });
  });

  Router.getAsync("/portfolio", async (req, res) => {
    let portfolio = await aggregatePortfolio(radiksData, req.query);
    portfolio = portfolioModifier(portfolio);
    res.json({ portfolio });
  });

  Router.getAsync("/project", async (req, res) => {
    let project = await aggregateProject(radiksData, req.query);
    project = projectModifier(project);
    res.json({ project });
  });

  return Router;
};

module.exports = makeApiController;
