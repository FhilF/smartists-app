import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { Person } from "@stacks/profile";

const appConfig = new AppConfig(["store_write", "publish_data"]);

export const userSession = new UserSession({ appConfig });
export const appDetails = {
  name: "Smartists",
  icon: window.location.origin + "/smartists-logo.png",
};

export function authenticate(props) {
  const { setIsNewSignIn } = props;
  showConnect({
    appDetails,
    // redirectTo: "/",
    onFinish: () => {
      setIsNewSignIn(true);
      // console.log(setIsNewSignIn)
    },
    userSession: userSession,
  });
}

export function signOut() {
  sessionStorage.removeItem("SmartistsUser");
  userSession.signUserOut(window.location.origin);
}

export function getUserData() {
  return userSession.loadUserData();
}

export function getPerson() {
  return new Person(getUserData().member);
}
