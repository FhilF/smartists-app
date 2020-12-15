import {
  aggregateDares,
  aggregateDaresAdmin,
  fixDaresAdmin,
} from "./aggregators/dares-aggregator";
import { aggregateEntries } from "./aggregators/entries-aggregator";
import { aggregateDurranUser } from "./aggregators/durranUser-aggregator";
import { entriesModifier } from "./modifier/entries-modifier";
import { durranUserModifier } from "./modifier/durranUser-modifier";

import moment from "moment";

const express = require("express");
const request = require("request-promise");
const { decorateApp } = require("@awaitjs/express");
const { COLLECTION } = require("radiks-server/app/lib/constants");
const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);

  Router.getAsync("/durranUser", async (req, res) => {
    let durranUser = await aggregateDurranUser(radiksData, req.query);
    durranUser = durranUserModifier(durranUser);
    res.json({ durranUser });
  });

  Router.getAsync("/entry", async (req, res) => {
    let entries = await aggregateEntries(radiksData, req.query);
    entries = entriesModifier(entries);
    res.json({ entries });
  });

  Router.getAsync("/entries", async (req, res) => {
    let entries = await aggregateEntries(radiksData, req.query);
    entries = entriesModifier(entries);
    res.json({ entries });
  });

  Router.getAsync("/dare", async (req, res) => {
    let dare = await aggregateDares(radiksData, req.query);
    res.json({ dare });
  });

  Router.getAsync("/dares", async (req, res) => {
    const query = { date: Date.parse(moment()) };
    let dares = await aggregateDares(radiksData, query);
    res.json({ dares });
  });

  Router.getAsync("/daresAdmin", async (req, res) => {
    let dares = await aggregateDaresAdmin(radiksData, req.query);
    dares = fixDaresAdmin(dares, moment);
    res.json({ dares });
  });

  Router.getAsync("/profile/:username", async (req, res) => {
    const { username } = req.params;
    const query = { durranUser: username, createdBy: username };
    let user = await aggregateUser(radiksData, query);
    let entries;
    if (user.length !== 0) {
      entries = await aggregateEntries(radiksData, query);
    }

    // if (!user) {
    //   const uri = `https://core.blockstack.org/v1/users/${username}`;
    //   try {
    //     const userData = await request({
    //       uri,
    //       json: true,
    //     });
    //     if (userData[username] && !userData[username].error) {
    //       user = {
    //         username,
    //         profile: userData[username].profile,
    //       };
    //     }
    //   } catch (error) {
    //     // user not found
    //   }
    // }

    res.json({ user, entries });
  });

  return Router;
};

module.exports = makeApiController;
