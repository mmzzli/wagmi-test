import { http } from "wagmi";
import { useState } from "react";
import contract from "./abi/StakingContractV3.json";
import { Button, Input, List, message, Typography, Upload } from "antd";
import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient } from "viem";
import { bsc } from "./chains/bsc.ts";

function App() {
  const [list, setList] = useState<
    { address: string; state: boolean; hash: "" }[]
  >([]);
  const [privateValue, setPrivateValue] = useState("");
  const [account, setAccount] = useState("");

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
        address: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
        abi: contract.abi,
        functionName: "setBlacklist",
        args: [address, true],
      });

      setList((prevList) =>
        prevList.map((item) =>
          item.address === address ? { ...item, state: true, hash } : item,
        ),
      );
      index++;
      await handlerContract(addressArr, index, walletClient);
    } catch (e) {
      message.error(`${address} is error`);
      console.log(e);
    }
  };
  const handlerClick = (info: any) => {
    console.log(info);
    // 读取文件
    console.log(info.file);

    const walletClient = createWalletClient({
      account: privateKeyToAccount(
        privateValue.startsWith("0x") ? privateValue : `0x${privateValue}`,
      ),
      chain: bsc,
      transport: http(),
    });

    const file = info.file.originFileObj || info.file; // 兼容 antd Upload 和标准 File

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content: string = e.target?.result as string;
      console.log("文件内容：", content);
      const addressArr: string[] = content.split("\n");

      let index = 0;

      setList(
        addressArr.map((item) => ({ address: item, state: false, hash: "" })),
      );
      await handlerContract(addressArr, index, walletClient);
    };

    reader.readAsText(file);
  };

  return (
    <>
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
                  <List.Item style={{ background: item.state ? "#eee" : "" }}>
                    <div>
                      <Typography.Text>{item.address}</Typography.Text>
                    </div>
                    {item.hash && <p>hash:{item.hash}</p>}
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

export default App;
