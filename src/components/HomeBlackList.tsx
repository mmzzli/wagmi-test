import { useEffect, useState } from "react";
import { getList } from "../service/black.ts";
import { List, Typography } from "antd";
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
      <div>仅展示最新 30条内容</div>
      <span>当前块高{blockNumber}</span>
      <div>
        <List
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
      </div>
    </>
  );
};

export default HomeBlackList;
