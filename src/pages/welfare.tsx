import { useEffect, useRef, useState } from "react";

import "../App.css";
import { List, Image, Typography, Button, Skeleton, Row } from "antd";
import dayjs from "dayjs";
const { Paragraph } = Typography;

const count = 6;
const fakeDataUrl = `/api/cms/coupons/getCouponList`;

const getQuery = (value: any) => {
  const result = Object.keys(value).reduce((cur, pre) => {
    return (cur += `${pre}=${value[pre]}&`);
  }, "?");

  return result.slice(0, -1);
};

function Welfare() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const params = useRef({
    page: 1,
    page_size: count,
    status: 2,
  });

  useEffect(() => {
    fetch(`${fakeDataUrl}${getQuery(params.current)}`)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.data.list);
        setList(res.data.list);
        setTotal(res.data.total);
      });
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    params.current = { ...params.current, page: params.current.page + 1 };
    fetch(`${fakeDataUrl}${getQuery(params.current)}`)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.data.list);
        setData(newData);
        setList(newData);
        setLoading(false);

        window.dispatchEvent(new Event("resize"));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>加载更多</Button>
      </div>
    ) : null;

  return (
    <List
      style={{ margin: 8 }}
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={count * params.current.page < total ? loadMore : null}
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          onClick={() => {
            window.open(item.url);
          }}
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={
                <Image
                  preview={false}
                  width={83}
                  height={83}
                  src={item.img_url}
                />
              }
              title={
                <Row align="middle" justify="space-between">
                  <a target="__blank">{item.name}</a>
                  <span>
                    {dayjs(item.publish_date).format("YYYY-MM-DD HH:MM:ss")}
                  </span>
                </Row>
              }
              description={
                <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
                  {item.content.replace(/<[^<>]+>/g, "")}
                </Paragraph>
              }
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
}

export default Welfare;
