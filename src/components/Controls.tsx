import { http } from "wagmi";
import { useMemo, useState } from "react";
import contractV3 from "../abi/StakingContractV3.json";
import contractV2 from "../abi/StakingContractV2.json";
import { Button, Input, List, message, Tabs, Typography, Upload } from "antd";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient } from "viem";
import { bsc } from "../chains/bsc.ts";

const map: any[] = [
  {
    key: "V3black",
    label: "V3 Set BlackList",
    contract: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
    abi: contractV3.abi,
    params: true,
  },
  {
    key: "V3white",
    label: "V3 Unblock",
    contract: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
    abi: contractV3.abi,
    params: false,
  },
  {
    key: "V2black",
    label: "V2 Set BlackList",
    contract: "0xc521983923625E14D0a45a7cDeA9C384fA1DEF13",
    abi: contractV2.abi,
    params: true,
  },
  {
    key: "V2white",
    label: "V2 Unblock",
    contract: "0xc521983923625E14D0a45a7cDeA9C384fA1DEF13",
    abi: contractV2.abi,
    params: false,
  },
];

function Controls() {
  const [list, setList] = useState<
    { address: string; state: number; hash: "" }[]
  >([]);
  const [active, setActive] = useState(map[0].key);
  const [privateValue, setPrivateValue] = useState("");
  const [account, setAccount] = useState("");

  const currentContract = useMemo(() => {
    return map.find((item) => item.key === active);
  }, [active]);

  const handlerContract = async (
    addressArr: string[],
    index = 0,
    walletClient: any,
  ) => {
    const address = addressArr[index];
    if (index >= addressArr.length) {
      return;
    }
    try {
      const hash = await walletClient.writeContract({
        address: currentContract.contract,
        abi: currentContract.abi,
        functionName: "setBlacklist",
        args: [address, currentContract.params],
      });

      setList((prevList) =>
        prevList.map((item) =>
          item.address === address ? { ...item, state: 2, hash } : item,
        ),
      );
      index++;
      setTimeout(async () => {
        await handlerContract(addressArr, index, walletClient);
      }, 1000);
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

  const handlerRetry = async (address: string) => {
    const index = list.findIndex((item) => item.address === address);
    const privateKey = privateValue.startsWith("0x")
      ? privateValue
      : `0x${privateValue}`;
    const account = privateKeyToAccount(privateKey as any);

    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(),
    });
    await handlerContract(
      list.map((item) => item.address),
      index,
      walletClient,
    );
  };
  const handlerClick = (info: any) => {
    console.log(info);
    // 读取文件
    console.log(info.file);

    const privateKey = privateValue.startsWith("0x")
      ? privateValue
      : `0x${privateValue}`;
    const account = privateKeyToAccount(privateKey as any);

    const walletClient = createWalletClient({
      account,
      chain: bsc,
      transport: http(),
    });

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
        addressArr.map((item) => ({ address: item, state: 1, hash: "" })),
      );
      await handlerContract(addressArr, index, walletClient);
    };

    reader.readAsText(file);
  };

  const onChange = (key: string) => {
    setActive(key);
    setPrivateValue("");
    setAccount("");
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
        <h2>Set black</h2>
        {account && <p>Address: {account}</p>}
      </div>

      {!account && (
        <Input
          value={privateValue}
          placeholder="Please input private key"
          onInput={(e: any) => {
            const value = e.target?.value;
            setPrivateValue(value);
            if (value) {
              const { address } = privateKeyToAccount(
                value.startsWith("0x") ? value : `0x${value}`,
              );
              setAccount(address);
            }
          }}
        ></Input>
      )}

      {account && (
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
                        item.state == 1
                          ? ""
                          : item.state == 2
                            ? "rgb(183,244,143)"
                            : item.state === 3
                              ? "rgb(255,204,199)"
                              : "",
                    }}
                  >
                    <div>
                      <Typography.Text>{item.address}</Typography.Text>
                    </div>
                    {item.hash && <p>hash:{item.hash}</p>}

                    {item.state == 3 && (
                      <Button onClick={() => handlerRetry(item.address)}>
                        Retry
                      </Button>
                    )}
                  </List.Item>
                );
              }}
            ></List>
          </div>
        </>
      )}
    </>
  );
}

export default Controls;
