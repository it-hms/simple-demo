import React, { useEffect, useState } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import {
  Stack,
  Text,
  Persona,
  PersonaPresence,
  Callout,
  PersonaSize,
  DefaultButton,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";

async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  const graphUrl = "https://graph.microsoft.com/v1.0/me";
  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphUrl, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

async function callMsGraphImage(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  const graphUrl = "https://graph.microsoft.com/v1.0/me/photos/48x48/$value";
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "image/jpeg");

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphUrl, options)
    .then((response) => response.blob())
    .catch((error) => console.log(error));
}

export const Ident = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [userName, setUserName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [userPrincipalName, setUserPrincipalName] = useState("");
  const [mail, setMail] = useState("");

  const [userImg, setUserImg] = useState("");

  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
    useBoolean(false);

  const personaId = useId("persona-id");

  useEffect(() => {
    if (account) {
      if (userName === "") {
        instance
          .acquireTokenSilent({
            scopes: ["profile", "User.Read"],
            account: account,
          })
          .then((response: any) => {
            if (response) {
              callMsGraph(response.accessToken).then((result) => {
                if (result) {
                  setUserName(result.displayName);
                  setAccountId(response.tenantId);
                  setMail(result.mail);
                  setUserPrincipalName(result.userPrincipalName);
                }
              });

              callMsGraphImage(response.accessToken).then((imgBlob) => {
                if (imgBlob) {
                  setUserImg(URL.createObjectURL(imgBlob));
                }
              });
            }
          })
          .catch((error: any) => {
            if (
              error.errorCode === "consent_required" ||
              error.errorCode === "interaction_required" ||
              error.errorCode === "login_required" ||
              error.errorCode === "invalid_grant"
            ) {
              // msalInstance.acquireTokenPopup(
              instance
                .acquireTokenPopup({
                  scopes: ["openid"],
                  account: account,
                })
                .then(function (response: {
                  accessToken: string;
                  tenantId: React.SetStateAction<string>;
                }) {
                  // call API
                  callMsGraph(response.accessToken).then((result) => {
                    if (result) {
                      setUserName(result.displayName);
                      setAccountId(response.tenantId);
                      setMail(result.mail);
                      setUserPrincipalName(result.userPrincipalName);
                    }
                  });

                  callMsGraphImage(response.accessToken).then((imgBlob) => {
                    if (imgBlob) {
                      setUserImg(URL.createObjectURL(imgBlob));
                    }
                  });
                })
                .catch(function (error: any) {
                  console.log(error);
                });
            }
            console.log(error);
          });
      }
    }
  }, [instance, account, userName]);

  const onClickPersona = () => {
    toggleIsCalloutVisible();
  };

  const onClickSignOut = () => {
    instance.logoutRedirect();
  };

  return (
    <Stack verticalAlign="end" tokens={{ childrenGap: 4, padding: 9 }}>
      <Stack.Item>
        <Persona
          imageUrl={userImg}
          presence={PersonaPresence.online}
          onClick={onClickPersona}
          id={personaId}
          size={PersonaSize.size32}
          text={userPrincipalName}
        />
      </Stack.Item>
      <Stack.Item>
        {isCalloutVisible && (
          <Callout
            role="alertdialog"
            target={`#${personaId}`}
            onDismiss={toggleIsCalloutVisible}
            gapSpace={0}
            isBeakVisible={false}
            style={{
              opacity: 0.95,
              padding: 10,
            }}
          >
            <LogOut
              username={userName}
              userPrincipal={userPrincipalName}
              onClick={onClickSignOut}
              mail={mail}
              accountId={accountId}
            />
          </Callout>
        )}
      </Stack.Item>
    </Stack>
  );
};

interface LogOutProps {
  username: string;
  mail: string;
  onClick: () => void;
  userPrincipal: string;
  accountId: string;
}
const LogOut: React.FC<LogOutProps> = ({
  username,
  mail,
  userPrincipal,
  accountId,
  onClick,
}) => {
  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <Stack.Item>
        <Text variant="large">User: {username}</Text>
      </Stack.Item>

      <Stack.Item>
        <Text variant="large">email: {mail}</Text>
      </Stack.Item>

      <Stack.Item>
        <Text variant="small">account Id: {accountId}</Text>
      </Stack.Item>

      <Stack.Item align="center">
        <DefaultButton text="Sign out" onClick={onClick} />
      </Stack.Item>
    </Stack>
  );
};
