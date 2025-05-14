import { http } from "wagmi";
import { useMemo, useState } from "react";
import contractV3 from "../abi/StakingContractV3.json";
import contractV2 from "../abi/StakingContractV2.json";
import { Button, List, message, Tabs, Typography, Upload } from "antd";
import { createPublicClient } from "viem";
import { bsc } from "../chains/bsc.ts";

const publicClient = createPublicClient({
  transport: http(),
  chain: bsc,
});
const map: any[] = [
  {
    key: "V3black",
    label: "V3查看",
    contract: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
    abi: contractV3.abi,
    func: "isInBlacklist",
  },
  {
    key: "V2black",
    label: "V2查看",
    contract: "0xc521983923625E14D0a45a7cDeA9C384fA1DEF13",
    abi: contractV2.abi,
    func: "isInBlacklist",
  },
];

function View() {
  const [list, setList] = useState<
    { address: string; state: number; isBlack: boolean }[]
  >([]);
  const [active, setActive] = useState(map[0].key);

  const currentContract = useMemo(() => {
    return map.find((item) => item.key === active);
  }, [active]);

  const handlerContract = async (addressArr: string[], index = 0) => {
    const address = addressArr[index];
    if (index >= addressArr.length) {
      return;
    }
    try {
      const res = await publicClient.readContract({
        address: currentContract.contract,
        abi: currentContract.abi,
        functionName: currentContract.func,
        args: [address],
      });

      setList((prevList) =>
        prevList.map((item) =>
          item.address === address
            ? { ...item, state: 2, isBlack: !!res }
            : item,
        ),
      );
      index++;
      // setTimeout(async () => {
      //   await handlerContract(addressArr, index);
      // }, 1000);
    } catch (e) {
      setList((prevList) =>
        prevList.map((item) =>
          item.address === address ? { ...item, state: 3, hash: "" } : item,
        ),
      );
      message.error(`${address} is error`);
      console.log(e);
    }
  };

  const handlerClick = (info: any) => {
    console.log(info);
    // 读取文件

    const file = info.file.originFileObj || info.file; // 兼容 antd Upload 和标准 File

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content: string = e.target?.result as string;
      console.log("文件内容：", content);
      let addressArr: string[] = content.split("\n");

      // 去重
      addressArr = Array.from(new Set(addressArr));
      addressArr = addressArr.filter((item) => item !== "");

      let index = 0;

      setList(
        addressArr.map((item) => ({ address: item, state: 1, isBlack: false })),
      );
      await handlerContract(addressArr, index);
    };

    reader.readAsText(file);
  };

  const onChange = (key: string) => {
    setActive(key);
    setList([]);
  };

  return (
    <>
      <Tabs
        centered
        defaultActiveKey={active}
        items={map}
        onChange={onChange}
      ></Tabs>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2>view black</h2>
      </div>

      {
        <>
          <div style={{ marginBottom: "20px" }}>
            <Upload
              onChange={handlerClick}
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button block={true} style={{ width: "100%" }}>
                Upload
              </Button>
            </Upload>
          </div>

          <div className="list">
            <List
              bordered
              dataSource={list}
              renderItem={(item) => {
                return (
                  <List.Item
                    style={{
                      background:
                        item.isBlack === true
                          ? "rgb(183,244,143)"
                          : "rgb(255,204,199)",
                    }}
                  >
                    <div>
                      <Typography.Text>{item.address}</Typography.Text>
                    </div>
                  </List.Item>
                );
              }}
            ></List>
          </div>
        </>
      }
    </>
  );
}

export default View;
