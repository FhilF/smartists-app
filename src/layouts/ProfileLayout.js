import user from "radiks/lib/models/user";
import React, {useEffect} from "react";
import ProfileNavigationComponent from "../components/ProfileNavigation";

function ProfileLayout(props) {
  const {
    children,
    userProfile,
    history,
    isLoading,
    isFetchingStudio,
  } = props;
  return (
    <div className="content-root">
      <div className="left-nav">
        <div className="left-nav-content">
          <ProfileNavigationComponent
            userProfile={userProfile}
            history={history}
            isPageLoading={isLoading}
            isFetchingStudio={isFetchingStudio}
          />
        </div>
      </div>
      <div className="main">
        <div className="content">{children}</div>
      </div>
      {/* {history.location.hash === "" && <ProfileComponent {...props} />}
          {<Studio {...props} />} */}
    </div>
  );
}

export default ProfileLayout;
