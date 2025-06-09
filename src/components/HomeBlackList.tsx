import { useEffect, useState } from "react";
import { getList } from "../service/black.ts";
import HomeCommonList from "./HomeCommonList.tsx";
const time = 5;

const HomeBlackList = () => {
  // 定时查看拉黑情况
  const [, setNumber] = useState(time);
  const [list, setList] = useState<any[]>([]);
  const [blockNumber, setBlockNumber] = useState(0);
  useEffect(() => {
    const getInfo = async () => {
      const res = await getList();
      setList(res.data.list);
      setBlockNumber(res.data.blockNumber);
    };
    getInfo();
    const timer = setInterval(() => {
      //   倒计时
      setNumber((number) => {
        if (number <= 0) {
          // 执行获取更表接口
          getInfo();
          clearInterval(timer);
          return time;
        }
        return number - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <>
      <div>Only the latest 30 entries are displayed</div>
      <span>Current Block Height{blockNumber}</span>
      <HomeCommonList list={list}></HomeCommonList>
    </>
  );
};

export default HomeBlackList;
