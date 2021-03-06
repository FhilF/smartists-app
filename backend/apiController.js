import moment from "moment";
import { aggregateSmartistsMember } from "./aggregators/smartistsMemberAggregator";
import { aggregateFeaturedArtwork } from "./aggregators/featuredArtworkAggregator";
import { aggregateProject } from "./aggregators/projectAggregator";
import { smartistsMemberModifier } from "./modifier/smartistsMemberModifier";
import { featuredArtworkModifier } from "./modifier/featuredArtworkModifier";
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

  Router.getAsync("/smartists-users", async (req, res) => {
    let smartistsUsers = await aggregateSmartistsMember(radiksData, req.query);
    smartistsUsers = smartistsMemberModifier(smartistsUsers);
    res.json({ smartistsUsers });
  });

  Router.getAsync("/featured-artwork", async (req, res) => {
    let featuredArtwork = await aggregateFeaturedArtwork(radiksData, req.query);
    featuredArtwork = featuredArtworkModifier(featuredArtwork);
    res.json({ featuredArtwork });
  });

  Router.getAsync("/project", async (req, res) => {
    let project = await aggregateProject(radiksData, req.query);
    project = projectModifier(project);
    res.json({ project });
  });

  return Router;
};

module.exports = makeApiController;
