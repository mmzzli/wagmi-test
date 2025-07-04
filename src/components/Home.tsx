import { useState } from "react";
import { Tabs } from "antd";
import HomeBlackList from "./HomeBlackList.tsx";
import HomeSearch from "./HomeSearch.tsx";

const tabs: any[] = [
  {
    key: "list",
    label: "Blacklist",
  },
  {
    key: "search",
    label: "Search Blacklisted Address",
  },
];
const Home = () => {
  const [active, setActive] = useState(tabs[0].key);
  const onChange = (key: string) => {
    setActive(key);
  };
  return (
    <>
      <Tabs
        centered
        defaultActiveKey={active}
        items={tabs}
        onChange={onChange}
      ></Tabs>
      {active === "list" && <HomeBlackList />}
      {active === "search" && <HomeSearch />}
    </>
  );
};
export default Home;
