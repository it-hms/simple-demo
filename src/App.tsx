import { Stack } from "@fluentui/react";
import React from "react";
import "./App.css";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="App">
      <Stack>
        <Header />
        <div>TODO</div>
      </Stack>
    </div>
  );
}

export default App;
