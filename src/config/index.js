import { StacksTestnet, StacksMainnet, StacksMocknet } from "@stacks/network";
import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
  BlocksApi,
  NonFungibleTokensApi
} from "@stacks/blockchain-api-client";
export const nodeEnv = process.env.NODE_ENV;

export const apiServer =
  nodeEnv === "development"
    ? process.env.REACT_APP_API_URL_DEVELOPMENT_SERVER
    : process.env.REACT_APP_API_URL_PRODUCTION_SERVER;

export const isMainnet =
  process.env.REACT_APP_STACKS_MAINNET === "true" ? true : false;

export const isMocknet =
  process.env.REACT_APP_STACKS_MOCKNET === "true" ? true : false;

export const StacksNetwork = isMainnet
  ? StacksMainnet
  : isMocknet
  ? StacksMocknet
  : StacksTestnet;

export const smartistsContractAddress = isMainnet
  ? ""
  : "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export const assetIdentifiers = ["ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.genuine-v1::Genuine"]

export const StacksApiUrl = isMainnet
  ? "https://stacks-node-api.mainnet.stacks.co"
  : isMocknet
  ? "http://localhost:3999"
  : "https://stacks-node-api.testnet.stacks.co";

export const StacksApiUriWs = isMainnet
  ? "wss://stacks-node-api.mainnet.stacks.co"
  : isMocknet
  ? "wss://localhost:3999"
  : "wss://stacks-node-api.testnet.stacks.co";

export const StacksExplorer = isMainnet
  ? "https://explorer.stacks.co"
  : "http://localhost:8000";

const config = new Configuration({ basePath: StacksApiUrl });
export const smartContractsApi = new SmartContractsApi(config);
export const accountsApi = new AccountsApi(config);
export const nonFungibleTokensApi = new NonFungibleTokensApi(config);

// export const Network =
//   process.env.REACT_APP_STACKS_MAINNET === "true"
//     ? "https://stacks-node-api.mainnet.stacks.co"
//     : process.env.REACT_APP_STACKS_MOCKNET === "true"
//     ? "http://localhost:3999"
//     : "https://stacks-node-api.testnet.stacks.co";

// export const apiServer = process.env.REACT_APP_API_URL_PRODUCTION_SERVER;
// export const apiServer = process.env.REACT_APP_API_URL_DEVELOPMENT_SERVER;
