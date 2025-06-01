import { useEffect, useState } from "react";
import { getList } from "../service/black.ts";
import { List, Typography } from "antd";
const time = 5;

const HomeBlackList = () => {
  // 定时查看拉黑情况
  const [number, setNumber] = useState(time);
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
      <div>还有{number}s 刷新</div>
      <span>当前块高{blockNumber}</span>
      <div>
        <List
          bordered
          dataSource={list}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[
                  item.hash && (
                    <a
                      target="_blank"
                      href={`https://bscscan.com/tx/${item.hash}`}
                    >
                      查看交易信息
                    </a>
                  ),
                ]}
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
  );
};

export default HomeBlackList;
