import { List, Typography } from "antd";
import "./style.css";
const HomeCommonList: React.FC<{ list: any[] }> = ({ list }) => {
  return (
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
          >
            <div style={{ width: "100%" }}>
              <div
                className={"list-style"}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography.Text>{item.address}</Typography.Text>
                {/*{item.blacked 为 true 是显示拉黑，但如果 item.black_hash 没有值则为外部拉黑}*/}
                <div>
                  {item.blacked ? (
                    item.black_hash ? (
                      <a
                        target="_blank"
                        href={`https://bscscan.com/tx/${item.black_hash}`}
                      >
                        {`${item.black_hash}`}
                      </a>
                    ) : (
                      <span>Externally Blacklisted</span>
                    )
                  ) : item.outBlacked ? (
                    <span>Externally Blacklisted</span>
                  ) : (
                    <span>Not Blacklisted</span>
                  )}
                </div>
              </div>
              <h4>Block Scanning Information</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>hash</span> <span>{item.hash}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>from</span> <span>{item.from_address}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>to</span> <span>{item.to_address}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>sync_id</span> <span>{item.sync_id}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>type</span>{" "}
                <span>
                  {item.type === 1
                    ? "Normal Transaction"
                    : "Contract Transaction"}
                </span>
              </div>
            </div>
          </List.Item>
        );
      }}
    ></List>
  );
};

export default HomeCommonList;
