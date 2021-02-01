import { UserSession, AppConfig } from 'blockstack';
import { addressToString } from '@blockstack/stacks-transactions';
import { didConnect } from 'react-blockstack';
import { authOrigin } from './lib/constants';

const _appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ _appConfig });


export const appConfig = new UserSession({
  appConfig: new AppConfig(['store_write', 'publish_data']),
});

export const finished = onDidConnect => ({ userSession }) => {
  didConnect({ userSession });
  onDidConnect({ userSession });
  console.log(userSession.loadUserData());
  const userData = userSession.loadUserData();
};

export const connectOptions = (onDidConnect) => {
  return {
    authOrigin: authOrigin,
    finished: finished(onDidConnect),
    appDetails: {
      name: 'Durran App',
      icon: window.location.origin + "/logo192.png",
    },
  };
};
