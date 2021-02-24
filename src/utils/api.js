import qs from "qs";
import { getConfig } from "radiks";

/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchSmartistsMemberAPI = async (query) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/smartists-user?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.smartistsUser;
};

/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchSmartistsMembersAPI = async (query) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/smartists-users?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.smartistsUsers;
};

/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchFeaturedArtworkAPI = async (query) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/featured-artwork?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.featuredArtwork;
};


/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchProjectAPI = async (query) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/project?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.project;
};
