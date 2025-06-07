import { Input } from "antd";
import { useEffect, useState } from "react";
import { searchBlack } from "../service/black";
import HomeCommonList from "./HomeCommonList.tsx";
import contractV3 from "../abi/StakingContractV3.json";
import { useReadContract } from "wagmi";

let timer: any = null;
const contractMap = {
  contract: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
  abi: contractV3.abi,
};
const HomeSearch = () => {
  const [value, setValue] = useState("");
  const [list, setList] = useState<any[]>([]);

  const { data: isBlacklisted } = useReadContract({
    address: contractMap.contract as any,
    abi: contractMap.abi,
    functionName: "isInBlacklist",
    args: [value],
  });

  useEffect(() => {
    if (list.length) {
      if (!list[0].hash) {
        // Update list with blacklist status
        setList((prevList) =>
          prevList.map((item) => ({
            ...item,
            isBlacklisted: isBlacklisted,
          })),
        );
      }
    }
  }, [list, isBlacklisted]);

  return (
    <>
      <h2>搜索拉黑地址</h2>
      <Input
        value={value}
        allowClear
        onClear={() => {
          setList([]);
          setValue("");
        }}
        placeholder="Please input address start with 0x"
        onInput={async (e: any) => {
          const value = e.target?.value;
          setValue(value);
          if (value?.trim()) {
            // 如果 value 存在 进行查询
            if (timer) {
              clearTimeout(timer);
            }
            timer = setTimeout(async () => {
              console.log(value);
              const res = await searchBlack(value);
              setList(res.data);
            }, 500);
          } else {
            setList([]);
          }
        }}
      ></Input>

      <HomeCommonList list={list}></HomeCommonList>
    </>
  );
};

export default HomeSearch;
