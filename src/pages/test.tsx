import React, { useState, useEffect, useRef } from "react";
import useLatest from "../hooks/useLatest";
import Test01 from "./components/test01";
import Test02 from "./components/test02";
import { Button, Select, SelectProps, Spin, theme } from "antd";
import ScrollLoadSelect from "./components/scrollLoadSelect";
import NormalTable from "./components/normalTable";
import dayjs from "dayjs";

const { useToken } = theme;

export default () => {
  const token = useToken();
  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useRef({
    page: 1,
    page_size: 20,
    q: undefined,
    status: undefined,
  });

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
      search: false,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        "0": { text: "全部" },
        "1": {
          text: "草稿",
        },
        "2": {
          text: "启用",
        },
        "3": {
          text: "发布",
        },
        "4": {
          text: "禁用",
        },
      },
    },
    {
      title: "创建日期",
      dataIndex: "create_date",
      key: "create_date",
      valueType: "dateRange",
      render: (_, record) => {
        return dayjs(record.create_date).format("YYYY-MM-DD HH:MM:ss");
      },
    },
  ];

  // 返回"id=xx&name=xx&age=xx&address=xx"
  const formatParams = () => {
    const result = Object.keys(params.current).reduce((cur, pre, index) => {
      return (
        cur + (params.current[pre] ? `${pre}=${params.current[pre]}&` : "")
      );
    }, "");
    return result.slice(0, -1);
  };

  const getCouponsInfo = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/cms/coupons/getCouponList?${formatParams()}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    const result = await response.json();
    setLoading(false);
    setCouponList(result.data);
  };

  useEffect(() => {
    getCouponsInfo();
  }, []);

  return (
    <>
      <NormalTable
        normalTableStyle={{ height: window.innerHeight }}
        loading={loading}
        dataSource={couponList?.list?.map((item) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
        onSearchEnterPress={(value) => {
          params.current = { ...params.current, q: value };
          getCouponsInfo();
        }}
        onFilterReset={() => {
          params.current = {
            ...params.current,
            status: undefined,
            q: undefined,
          };
          getCouponsInfo();
        }}
        onFilterConfirm={(value) => {
          const q = value.find((item) => item.key === "name")?.value;
          const status = value.find((item) => item.key === "status")?.value
            ?.value;
          const newStatus =
            Number(status) - 1 == -1 ? undefined : Number(status) - 1;
          console.log(newStatus);
          params.current = { ...params.current, q, status: newStatus };
          getCouponsInfo();
        }}
        pagination={{
          page: params.current.page,
          pageSize: params.current.page_size,
          total: couponList.total,
          onChange: (page, pageSize) => {
            params.current = { ...params.current, page };
            getCouponsInfo();
          },
        }}
        scroll={{ x: 100, y: window.innerHeight }}
      />
    </>
  );
};
