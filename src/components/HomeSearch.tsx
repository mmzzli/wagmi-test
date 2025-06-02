import { Input, List, Typography } from "antd";
import { useState } from "react";
import { searchBlack } from "../service/black";

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

      <List
        style={{ marginTop: "20px" }}
        bordered
        dataSource={list}
        renderItem={(item) => {
          return (
            <List.Item
              style={{
                background:
                  item.blacked == 1 ? "rgb(255,204,199)" : "rgb(183,244,143)",
              }}
              actions={[
                item.hash ? (
                  <a
                    target="_blank"
                    href={`https://bscscan.com/tx/${item.hash}`}
                  >
                    {`https://bscscan.com/tx/${item.hash}`}
                  </a>
                ) : (
                  <span>外部拉黑</span>
                ),
              ]}
            >
              <div>
                <Typography.Text>{item.address}</Typography.Text>
                <div>{item.blacked ? "已拉黑" : "未拉黑"}</div>
              </div>
            </List.Item>
          );
        }}
      ></List>
    </>
  );
};

export default HomeSearch;
