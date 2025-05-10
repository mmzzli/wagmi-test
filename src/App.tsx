import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { bsc } from "wagmi/chains";
import { useEffect } from "react";

// @ts-ignore
import contract from "./abi/StakingContractV3.json";
import { Button, Upload } from "antd";
import { config } from "./wagmi.ts";
import { useWriteContracts } from "wagmi/experimental";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // 读取USDT decimals

  const { writeContractAsync } = useWriteContract({ config });

  const handlerContract = async (addressArr: string[], index = 0) => {
    const address = addressArr[index];
    if (index >= addressArr.length) {
      return;
    }
    try {
      const res = await writeContractAsync({
        address: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
        abi: contract.abi,
        functionName: "setBlacklist",
        args: [address, true],
      });
      console.log(res);
      console.log(error);
      index++;
      //await handlerContract(addressArr, index);
    } catch (e) {
      console.log(e);
    }
  };
  const handlerClick = (info: any) => {
    console.log(info);
    // 读取文件
    console.log(info.file);
    const file = info.file.originFileObj || info.file; // 兼容 antd Upload 和标准 File

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content: string = e.target?.result as string;
      console.log("文件内容：", content);
      const addressArr: string[] = content.split("\n");

      let index = 0;
      await handlerContract(addressArr, index);
    };

    reader.readAsText(file);
    //
    // writeContract({
    //   address: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
    //   abi: contract.abi,
    //   functionName: "setBlacklist",
    //   args: ["", true],
    // });
  };

  useEffect(() => {
    if (account.status === "disconnected") {
      const injectedConnector = connectors.find((c) => c.name === "Injected");
      if (injectedConnector) {
        connect({ connector: injectedConnector });
      }
    }
  }, [account.status, connect, connectors]);

  useEffect(() => {
    // 如果已连接但不是BSC链，切换到BSC
    if (account.status === "connected" && account.chainId !== bsc.id) {
      switchChain({ chainId: bsc.id });
    }
  }, [account.status, account.chainId, switchChain]);

  return (
    <>
      <div>
        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <Upload
          onChange={handlerClick}
          showUploadList={false}
          beforeUpload={() => false}
        >
          <Button>Upload</Button>
        </Upload>
      </div>

      <div>
        <h2>Connect</h2>
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default App;
