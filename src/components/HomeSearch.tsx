import { Input } from "antd";
import { useState } from "react";
import { searchBlack } from "../service/black";
import HomeCommonList from "./HomeCommonList.tsx";
import contractV3 from "../abi/StakingContractV3.json";
import { http } from "wagmi";
import { createPublicClient } from "viem";
import { bsc } from "../chains/bsc.ts";

const walletClient = createPublicClient({
  chain: bsc,
  transport: http(),
});

let timer: any = null;
const contractMap = {
  contract: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
  abi: contractV3.abi,
};
const HomeSearch = () => {
  const [value, setValue] = useState("");
  const [list, setList] = useState<any[]>([]);

  return (
    <>
      <h2>Search Blacklisted Address</h2>
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

              // 查询合约
              if (res.data.length && !res.data[0].blacked) {
                try {
                  const contractRes = await walletClient.readContract({
                    address: contractMap.contract as any,
                    abi: contractMap.abi,
                    functionName: "isInBlacklist",
                    args: [value],
                  });
                  console.log(contractRes);
                  // 更新数据
                  const newData = res.data;
                  if (newData[0]) {
                    newData[0] = { ...newData[0], outBlacked: contractRes };
                  }
                  setList(newData);
                } catch (err) {
                  console.log(err);
                  setList(res.data);
                }
              } else {
                setList(res.data);
              }
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
