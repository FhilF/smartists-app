import React from "react";
import ProfileNavigationComponent from "../components/ProfileNavigation";

function ProfileLayout(props) {
  const { children, userProfile, history, isPageLoading } = props;
  return (
    <div className="content-root">
      <div className="left-nav">
        <div className="left-nav-content">
          <ProfileNavigationComponent
            userProfile={userProfile}
            history={history}
            isPageLoading={isPageLoading}
          />
        </div>
      </div>
      <div className="main">
        <div className="content">
          {children}
          {/* {history.location.hash === "" && <ProfileComponent {...props} />}
          {<Studio {...props} />} */}
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
