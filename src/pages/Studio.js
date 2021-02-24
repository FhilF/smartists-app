import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import FeaturedArtwork from "./FeaturedArtwork";
import FeaturedProject from "./FeaturedProject";

function Studio(props) {
  const { match, isUser, history } = props;
  return (
    <Switch>
      <Route
        path={`${match.url}/`}
        component={() => <FeaturedArtwork {...props} />}
        exact
      />
      <Route
        path={`${match.url}/project`}
        component={() => <FeaturedProject {...props} />}
      />
      <Route component={() => <NotFound {...props} />} />
    </Switch>
  );
}

function NotFound(props) {
  const { history } = props;
  useEffect(() => {
    history.push("/404");
  }, []);
  return <></>;
}

export default Studio;
