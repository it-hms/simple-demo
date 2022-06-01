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
            <div>TODO</div>
          </Stack>
        </div>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}

export default App;
