import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  Typography,
  message,
} from "antd";
import "../App.css";
import dayjs from "dayjs";
import { useFpId } from "../hooks/useFpId";

const fakeDataUrl = `/api/cms/setting`;
const registerUrl = `/api/cms/users/register`;

const { Paragraph } = Typography;

const initPayload = {
  name: "",
  mobile: "",
  birthday: "",
  company: "",
  industry: "",
  remark: "",
};

const getFormLabel = (value: string) => {
  switch (value) {
    case "name":
      return "姓名";
    case "mobile":
      return "手机号";
    case "company":
      return "公司行业";
    case "remark":
      return "备注";
  }
};

const Demo: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const fpHash = useFpId();

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        const target = JSON.parse(res.data.content).demo.find(
          (item) => item.type === "initForm"
        );
        const result = target.checked && target.visibled ? target.children : [];
        setData(result);
      });
  }, []);

  const getFormItemRules = (type: string, required: boolean) => {
    switch (type) {
      case "name":
        return [{ required, message: "请输入姓名" }];
      case "mobile":
        return [
          { required, message: "请输入手机号" },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: "请输入正确的手机号",
          },
        ];
      case "birthday":
        return [{ required, message: "请输入日期" }];
      case "company":
        return [{ required, message: "请输入公司名称" }];
      case "industry":
        return [{ required, message: "请输入行业" }];
      case "remark":
        return [{ required, message: "请输入备注" }];
    }
  };

  const getFormItemRender = (item) => {
    switch (item.type) {
      case "birthday":
        return (
          <Form.Item
            label="生日"
            name="birthday"
            rules={getFormItemRules(item.type, item.require)}
          >
            <DatePicker
              placeholder={item.value || "请选择日期"}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
      case "industry":
        return (
          <Form.Item
            label="公司行业"
            name="industry"
            rules={getFormItemRules(item.type, item.require)}
          >
            <Select
              placeholder={item.value || "请选择"}
              options={[
                { value: "服务行业", label: "服务行业" },
                { value: "零售行业", label: "零售行业" },
                { value: "家居行业", label: "家居行业" },
                { value: "其他", label: "其他" },
              ]}
            />
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            label={getFormLabel(item.type)}
            name={item.type}
            rules={getFormItemRules(item.type, item.require)}
          >
            <Input placeholder={item.value} />
          </Form.Item>
        );
    }
  };

  const onFinish = async (value) => {
    const targetParams = {
      ...value,
      source: 2,
      birthday: dayjs(value.birthday).format("YYYY-MM-DD"),
      fingerprint_id: fpHash,
    };

    try {
      const response = await fetch(registerUrl, {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(targetParams),
      });
      await response.json();
      form.setFieldsValue(initPayload);
      message.success("提交成功");
    } catch (error) {
      message.error("未知错误");
    }
  };

  if (loading) return <Spin style={{ width: "100%", marginTop: 100 }} />;

  return (
    <>
      <Paragraph
        style={{ textAlign: "center", marginBottom: 0, marginTop: 20 }}
      >
        请完善以下信息，产品顾问将在1个工作日内与您联系
      </Paragraph>

      <Form
        form={form}
        style={{ maxWidth: 500, margin: "auto", padding: "20px" }}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {data.map((item) => {
          return item.visibled && getFormItemRender(item);
        })}

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: "100%", backgroundColor: "#2956ff" }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Demo;
