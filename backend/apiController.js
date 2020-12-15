import moment from "moment";

const express = require("express");
const request = require("request-promise");
const { decorateApp } = require("@awaitjs/express");
const { COLLECTION } = require("radiks-server/app/lib/constants");
const makeApiController = (db) => {
  const Router = decorateApp(express.Router());
  const radiksData = db.collection(COLLECTION);



  return Router;
};

module.exports = makeApiController;
