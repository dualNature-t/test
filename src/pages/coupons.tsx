/**
 * @file
 * @date 2024-01-16
 * @author haodong.wang
 * @lastModify  2024-01-16
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
import "./coupons.css";
import {
  Col,
  Row,
  Typography,
  Image,
  Button,
  Tag,
  message,
  Modal,
  Form,
  Input,
  Affix,
  Spin,
} from "antd";
import { useQuery } from "../hooks/useQuery";
import { wxShareInit } from "../utils/wechatShare";
import ShareQrcode from "./components/shareQrcode";
import useVisitorId from "../hooks/useVisitorId";

const { Title, Text } = Typography;
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */

/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Coupons = (): JSX.Element => {
  /* <------------------------------------ **** STATE START **** ------------------------------------ */
  /************* This section will include this component HOOK function *************/
  const { id, c, person_id, object_id, object_type, object_type_id, flag } =
    useQuery();
  const [form] = Form.useForm();
  const fingerprint_id = useVisitorId();

  const [couponData, setCouponData] = useState<any>({ couponInfo: {} });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOverdue =
    new Date(couponData.couponInfo?.due_date).getTime() < new Date().getTime();

  /* <------------------------------------ **** STATE END **** ------------------------------------ */
  /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
  /************* This section will include this component parameter *************/
  /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
  /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
  // 获取优惠券信息
  const getCouponsInfo = async () => {
    const response = await fetch(
      `/api/cms/coupons/getPageInfo?id=${id ?? ""}&c=${c ?? ""}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    const result = await response.json();
    setLoading(false);
    setCouponData(result.data);
  };

  // 登录
  const handleLogin = async () => {
    try {
      await form.validateFields();
    } catch (error) {
      return;
    }

    const { nick_name, mobile } = form.getFieldsValue();
    const response = await fetch("/api/cms/users/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        mobile,
        coupon_id: id,
        person_id,
        object_id,
        object_type,
        object_type_id,
        nick_name,
        flag,
      }),
    });
    const result = await response.json();
    // 登录成功
    if (result.status === 200) {
      const { mobile, isRecive } = result.data;
      handleCoupon(mobile);
      viewCouponInfo(mobile);
      setLoginModalOpen(false);
      setCouponData({ ...couponData, isRecive, token: mobile });
    } else {
      message.error(result.message);
    }
  };

  // 登出
  const handleLogout = async () => {
    await fetch("/api/cms/users/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    location.reload();
  };

  // 领取优惠卷
  const handleCoupon = async (mobile) => {
    const response = await fetch("/api/cms/coupons/getCoupon", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        coupon_id: id,
        mobile,
        fingerprint_id,
      }),
    });

    const result = await response.json();

    // 领取成功
    if (result.status === 200) {
      setCouponData({ ...couponData, isRecive: true });
      message.success("领取成功");
    } else {
      message.error("领取失败，您已经有该优惠券");
    }
  };

  // 浏览优惠卷
  const viewCouponInfo = async (mobile) => {
    const response = await fetch("/api/cms/behavior/view", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        type: 0,
        mobile: mobile ?? "",
        target_id: id,
        fingerprint_id,
      }),
    });

    const result = await response.json();

    // 浏览成功
    if (result.status === 200) {
      // console.log("浏览成功");
    }
  };

  const handleBtnClick = () => {
    if (couponData.isRecive || isOverdue) return;
    if (couponData.token) {
      // 登陆了
      handleCoupon(couponData.token);
    } else {
      // 没登陆
      setLoginModalOpen(true);
    }
  };

  const getBtnText = () => {
    if (isOverdue) {
      return "已过期";
    }

    if (couponData.token) {
      if (couponData.isRecive) {
        return "已领取";
      } else {
        return "立即领取";
      }
    } else {
      return "立即领取";
    }
  };
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
  /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
  useEffect(() => {
    getCouponsInfo();
  }, []);

  useEffect(() => {
    if (Object.keys(couponData.couponInfo).length > 0 && fingerprint_id) {
      wxShareInit(window.location.href, couponData.couponInfo);
      viewCouponInfo(couponData.token);
    }
  }, [couponData.couponInfo?.id, fingerprint_id]);
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** EFFECT END **** ------------------------------------ */
  if (loading)
    return (
      <Row align="middle" justify="center" style={{ height: 500 }}>
        <Spin></Spin>
      </Row>
    );

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 600,
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <ShareQrcode />

      <div style={{ background: "#fff", padding: "36px 28px 24px" }}>
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <Title style={{ marginTop: 0 }} level={3}>
              {couponData.couponInfo?.name}
            </Title>
          </Col>
          <Col md={0} sm={2} xs={2}>
            <ShareQrcode isMobile />
          </Col>
        </Row>
        <Row gutter={10} align="middle">
          <Col>
            <Tag bordered={false} style={{ fontSize: 12 }}>
              原创
            </Tag>
          </Col>
          <Col style={{ fontSize: 12 }}>
            {couponData.couponInfo?.author_link ? (
              <a target="__blank" href={couponData.couponInfo?.author_link}>
                {couponData.couponInfo?.author}
              </a>
            ) : (
              couponData.couponInfo?.author
            )}
          </Col>
          <Col>
            <Text style={{ fontSize: 12 }} type="secondary">
              {new Date(couponData.couponInfo?.publish_date).toLocaleString()}
            </Text>
          </Col>
        </Row>

        <Row style={{ marginTop: 18, marginBottom: 24, cursor: "pointer" }}>
          <Image
            onClick={handleBtnClick}
            preview={false}
            width={"100%"}
            src={couponData.couponInfo?.img_url}
          ></Image>
        </Row>

        <Row>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={handleBtnClick}
            disabled={isOverdue || couponData.isRecive}
          >
            {getBtnText()}
          </Button>
        </Row>

        {couponData.couponInfo?.qr_code && (
          <Row
            align={"middle"}
            justify={"center"}
            style={{
              flexDirection: "column",
              padding: "16px 0",
              background: "#f7f8fa",
              borderRadius: "0 0 12px 12px",
              fontSize: 14,
              marginTop: 24,
            }}
          >
            <Image width={120} src={couponData.couponInfo?.qrcode_img}></Image>
            <Text style={{ display: "inline-block", marginTop: 16 }}>
              扫描二维码，添加专属联系人
            </Text>
            <Text>(分享复制至微信可打开)</Text>
          </Row>
        )}
      </div>

      <div
        style={{
          minHeight: 330,
          background: "#f7f8fa",
          padding: "18px 28px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            textAlign: "center",
            marginBottom: 12,
            color: "#000",
          }}
        >
          ——— <span style={{ margin: "0 20px" }}>活动规则</span> ———
        </div>
        <div
          className="dazdataMic-editor-content"
          style={{ color: "#646466cc", fontSize: 13 }}
          dangerouslySetInnerHTML={{
            __html: couponData.couponInfo?.content?.replace(/\t/g, "&emsp;"),
          }}
        ></div>
      </div>

      {couponData.couponInfo?.business_cards && (
        <div className="coupon_businessCards">
          <p>··· E N D ···</p>
          <Image
            preview={false}
            width="100%"
            src={couponData.couponInfo.business_img}
          />
        </div>
      )}

      <Modal
        open={loginModalOpen}
        onCancel={() => setLoginModalOpen(false)}
        footer={null}
      >
        <Form form={form} name="basic" layout="vertical" autoComplete="off">
          <Form.Item
            label="称呼"
            name="nick_name"
            rules={[{ required: true, message: "请输入称呼" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              onClick={handleLogin}
            >
              立即领取
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Coupons;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
