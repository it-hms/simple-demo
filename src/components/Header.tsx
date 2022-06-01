import { Stack } from "@fluentui/react";
import { Ident } from "./Ident";

export const Header = () => {
  return (
    <Stack horizontal horizontalAlign="end" className="HeaderContainer">
      <Ident />
    </Stack>
  );
};
