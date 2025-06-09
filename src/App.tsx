import Controls from "./components/Controls.tsx";
import { useState } from "react";
import { Tabs } from "antd";
import View from "./components/View.tsx";
import Home from "./components/Home.tsx";

const tabs: any[] = [
  {
    key: "home",
    label: "Blacklist Management",
  },
  {
    key: "controls",
    label: "Blacklist / Remove from Blacklist",
  },
  {
    key: "view",
    label: "Check Blacklist Status",
  },
];

const App = () => {
  const [active, setActive] = useState(tabs[0].key);
  return (
    <>
      <Tabs
        centered
        defaultActiveKey={active}
        items={tabs}
        onChange={(key: string) => {
          setActive(key);
        }}
      ></Tabs>
      {active === "home" && <Home />}
      {active === "controls" && <Controls></Controls>}
      {active === "view" && <View></View>}
    </>
  );
};

export default App;
