import { Stack } from "@fluentui/react";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";

import React from "react";
import "./App.css";
import {
  ErrorComponent,
  LoadingComponent,
  loginRequest,
  msalConfig,
} from "./AuthCfg";
import { Header } from "./components/Header";

import { initializeIcons } from "@fluentui/react/lib/Icons";
import { Search } from "./components/Search";

initializeIcons();

function App() {
  const msalInstance = new PublicClientApplication(msalConfig);
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={loginRequest}
        errorComponent={ErrorComponent}
        loadingComponent={LoadingComponent}
      >
        <div className="App">
          <Stack>
            <Header />
            <div className="TSISearchContainer">
              <Search />
            </div>
          </Stack>
        </div>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}

export default App;
