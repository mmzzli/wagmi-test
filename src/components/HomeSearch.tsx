import { Input } from "antd";
import { useState } from "react";
import { searchBlack } from "../service/black";
import HomeCommonList from "./HomeCommonList.tsx";

let timer: any = null;

const HomeSearch = () => {
  const [value, setValue] = useState("");
  const [list, setList] = useState<any[]>([]);

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
