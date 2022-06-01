import { useAccount, useMsal } from "@azure/msal-react";
import { PrimaryButton, Stack, TextField } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { getTokenFromResponse } from "../AuthCfg";
import { SearchResults } from "./SearchResults";
import { tsiApiScopes, tsiSearch } from "./tsiSearch";

export const Search = () => {
  const { accounts, instance } = useMsal();
  const account = useAccount(accounts[0] || {});

  const [searchValue, setSearchValue] = React.useState("");
  const onChangeFirstTextFieldValue = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setSearchValue(newValue || "");
    },
    []
  );

  const [searchClick, setSearchClick] = useState(false);
  const [results, setResults] = useState<string[2][] | undefined>();

  useEffect(() => {
    if (account && searchClick) {
      instance
        .acquireTokenSilent({
          scopes: tsiApiScopes,
          account: account,
        })
        .then(async (response) => {
          const res = await tsiSearch(
            getTokenFromResponse(response),
            searchValue
          );
          console.log(res);
          setResults(res);
        })
        .catch((error) => {
          console.log(error);
        });
      setSearchClick(false);
    }
  }, [account, instance, searchValue, searchClick]);

  return (
    <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
      <Stack.Item>
        <TextField
          label="Search for Time Series Id - try 'ax-test2'"
          value={searchValue}
          onChange={onChangeFirstTextFieldValue}
        />
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton
          text="search"
          onClick={() => {
            setSearchClick(true);
          }}
        />
      </Stack.Item>
      <Stack.Item>
        <SearchResults results={results} />
      </Stack.Item>
    </Stack>
  );
};
