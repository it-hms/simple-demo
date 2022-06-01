import axios from "axios";
import { hmsEnvfqdn } from "../AuthCfg";

export const tsiApiScopes = [
  "openid",
  "https://api.timeseries.azure.com//user_impersonation",
];

export const tsiInstanceUrl = `https://${hmsEnvfqdn}/timeseries/`;
export const tsiQueryParams = {
  "api-version": "2020-07-31",
};

// Uri path for search
const tsiSearchPath = "instances/search";

/**
 * Tsi search response hit
 *
 * @typeParam timeSeriesId - ID Array
 *
 * @typeParam typeId -  GUID used by TSI
 *
 * @typeParam hierarchyIds -  Array used by TSI
 *
 * @typeParam highlights -  Object used by TSI - not used/validated
 */
type TsiHit = {
  timeSeriesId: string[];
  typeId: string;
  hierarchyIds: any;
  highlights: any;
};

/**
 * Tsi search response
 *
 * @typeParam hitCount -  number of search hits
 *
 * @typeParam hits - array of hits @see {@link TsIHit}
 */
type TsiSearchResp = {
  hitCount: number;
  hits: TsiHit[];
};

/**
 *  Validate that the data returned has required fields.
 *
 * @param data - data response from API
 *
 * @returns boolean is data validated
 */
function isSearchResp(data: any): data is TsiSearchResp {
  return (
    (data as TsiSearchResp).hitCount !== undefined &&
    (data as TsiSearchResp).hits !== undefined &&
    (data as TsiSearchResp).hits.length !== undefined
  );
}

/**
 * Search TSI Ids for asset.
 *
 * @param auth - authentication token
 *
 * @param prop -  TSI db indexing property
 *
 * @throws Error for bad response, and any number of different exceptions from
 *  axios
 *
 * @returns Array of string[2] - Time Series Ids: tuples of the format:
 * ["tagname", "assetId"] that contain the assetId
 */
export const tsiSearch = async (auth: string, prop: string) => {
  const bearer = `Bearer ${auth}`;
  const result = await axios({
    url: tsiInstanceUrl + tsiSearchPath,
    method: "post",
    headers: {
      Authorization: bearer,
    },
    params: tsiQueryParams,
    data: { searchString: prop },
  });
  // Result validation
  if (result.data.instances.hitCount && result.data.instances.hitCount > 0) {
    if (isSearchResp(result.data.instances)) {
      const idsList = result.data.instances.hits.map((hit: TsiHit) => {
        return hit.timeSeriesId;
      });
      return idsList;
    }
  } else {
    if (result.data.instances.hits && result.data.instances.hits.length === 0) {
      throw new Error(
        "Time Series search yielded no results for device " + prop + " ."
      );
    }
    console.log(result);
    throw new Error("Unexpected Time Series search results.");
  }
};
