import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ProfilePage from "../pages/Profile";
import HomePage from "../pages/Home";
import StudioPage from "../pages/Studio";
import FormPage from "../pages/Form";

function SuperUserRoutes(props) {
  return (
    <div>
      <Switch>
        <Route
          exact
          path="/"
          Component
          render={(routeProps) => <HomePage {...routeProps} />}
        />
        <Route
          path="/profile/:username"
          Component
          render={(routeProps) => <ProfilePage {...routeProps} {...props}/>}
        />
        <Route
          path="/studio/:username"
          Component
          render={(routeProps) => <StudioPage {...routeProps} {...props}/>}
        />
        {/* <Route
          path="/signup"
          Component
          render={(routeProps) => <FormPage {...routeProps}/>}
        /> */}
      </Switch>
    </div>
  );
}

export default SuperUserRoutes;
