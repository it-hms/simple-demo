import { Configuration, PopupRequest } from "@azure/msal-browser";
import { MsalAuthenticationResult } from "@azure/msal-react";
import { AuthenticationResult } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "",
    authority:
      "https://login.microsoftonline.com/5c7c1590-4488-4e42-bc9c-15218f8ac994",
    postLogoutRedirectUri: "https://hms-networks.com",
  },
};

export const loginRequest: PopupRequest = {
  scopes: ["User.Read", "https://api.timeseries.azure.com//user_impersonation"],
};

export const hmsEnvfqdn = process.env.REACT_APP_TSI_ENV_FDN;

export const ErrorComponent: React.FC<MsalAuthenticationResult> = ({
  error,
}) => {
  console.log(error);
  return <p>An Error Occurred:{error?.errorMessage} </p>;
};

export function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

export const getTokenFromResponse = (response: AuthenticationResult) => {
  if (response.accessToken === null) {
    throw new Error(
      "Token access response successful, but missing access token"
    );
  }
  return response.accessToken;
};
