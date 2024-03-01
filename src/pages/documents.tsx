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
import getTextFromHTML from "../utils/getTextFromHtml";
import { wxShareInit } from "../utils/wechatShare";
import ShareQrcode from "./components/shareQrcode";
import useVisitorId from "../hooks/useVisitorId";

const { Title, Text, Paragraph } = Typography;
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Documents = (): JSX.Element => {
  /* <------------------------------------ **** STATE START **** ------------------------------------ */
  /************* This section will include this component HOOK function *************/
  const { id, c, person_id, object_id, object_type, object_type_id, flag } =
    useQuery();
  const [form] = Form.useForm();
  const fingerprint_id = useVisitorId();
  const [loading, setLoading] = useState(true);

  const [documentData, setDocumentData] = useState<any>({
    documentInfo: {},
    couponInfo: {},
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // const isOverdue =
  //   new Date(documentData.documentInfo?.due_date).getTime() <
  //   new Date().getTime();
  /* <------------------------------------ **** STATE END **** ------------------------------------ */
  /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
  /************* This section will include this component parameter *************/
  /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
  /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
  // 获取文档信息
  const getDocumentInfo = async () => {
    const response = await fetch(
      `/api/cms/documents/getPageInfo?id=${id ?? ""}&c=${c ?? ""}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    const result = await response.json();
    setLoading(false);
    setDocumentData(result.data);
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
      const { mobile } = result.data;
      handleCoupon(mobile);
      viewDocumentInfo(mobile);
      setLoginModalOpen(false);
      setDocumentData({ ...documentData, token: mobile });
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
        coupon_id: documentData.couponInfo?.id,
        mobile,
        fingerprint_id,
      }),
    });

    const result = await response.json();

    // 领取成功
    if (result.status === 200) {
      setDocumentData({ ...documentData, isRecive: true });
      message.success("领取成功");
    } else {
      message.error("领取失败，您已经有该优惠券");
    }
  };

  // 浏览优惠卷
  const viewDocumentInfo = async (mobile) => {
    const response = await fetch("/api/cms/behavior/view", {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        type: 1,
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
    if (documentData.isRecive) return;
    if (documentData.token) {
      // 登陆了
      handleCoupon(documentData.token);
    } else {
      // 没登陆
      setLoginModalOpen(true);
    }
  };

  /************* This section will include this component general function *************/
  /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
  /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
  useEffect(() => {
    getDocumentInfo();
  }, []);

  useEffect(() => {
    if (Object.keys(documentData.documentInfo).length > 0 && fingerprint_id) {
      wxShareInit(window.location.href, documentData.documentInfo);
      viewDocumentInfo(documentData.token);
    }
  }, [documentData.documentInfo?.id, fingerprint_id]);
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
        background: "#fff",
      }}
    >
      <ShareQrcode />

      <div style={{ padding: "36px 28px 28px" }}>
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <Title style={{ marginTop: 0 }} level={3}>
              {documentData.documentInfo?.name}
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
            {documentData.documentInfo?.author_link ? (
              <a target="__blank" href={documentData.documentInfo?.author_link}>
                {documentData.documentInfo?.author}
              </a>
            ) : (
              documentData.documentInfo?.author
            )}
          </Col>
          <Col>
            <Text style={{ fontSize: 12 }} type="secondary">
              {new Date(
                documentData.documentInfo?.publish_date
              ).toLocaleString()}
            </Text>
          </Col>
        </Row>

        <Row style={{ marginTop: 18, marginBottom: 24, cursor: "pointer" }}>
          {documentData.documentInfo?.doc_type === 0 ? (
            <Image
              preview={false}
              width={"100%"}
              src={documentData.documentInfo?.img_url}
            ></Image>
          ) : (
            <video
              style={{ width: "100%" }}
              controls
              autoPlay
              src={documentData.documentInfo?.video_url}
            ></video>
          )}
        </Row>

        <div
          className="dazdataMic-editor-content"
          style={{
            marginTop: 20,
            marginBottom: 20,
            color: "#646466",
            fontSize: 14,
            lineHeight: 1.5,
          }}
          dangerouslySetInnerHTML={{
            __html: documentData.documentInfo?.content?.replace(
              /\t/g,
              "&emsp;"
            ),
          }}
        ></div>

        {Object.keys(documentData.couponInfo).length > 0 && (
          <Row
            onClick={handleBtnClick}
            wrap={false}
            style={{
              background: "#f7f8fa",
              marginTop: 15,
              cursor: "pointer",
              borderRadius: 6,
              padding: "20px 25px",
            }}
          >
            <Col style={{ marginRight: 20 }}>
              <Image
                preview={false}
                width={80}
                height={80}
                src={documentData.couponInfo?.img_url}
              ></Image>
            </Col>
            <Col>
              <Title
                style={{ marginTop: 0, fontSize: 14, marginBottom: 10 }}
                level={5}
              >
                {documentData.couponInfo?.name}
              </Title>
              <Paragraph
                ellipsis={{ rows: 2 }}
                type="secondary"
                style={{ fontSize: 12 }}
              >
                {getTextFromHTML(documentData.couponInfo?.content)}
              </Paragraph>
            </Col>
          </Row>
        )}

        {documentData.documentInfo?.qr_code && (
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
            <Image
              width={120}
              src={documentData.documentInfo?.qrcode_img}
            ></Image>
            <Text style={{ display: "inline-block", marginTop: 16 }}>
              扫描二维码，添加专属联系人
            </Text>
            <Text>(分享复制至微信可打开)</Text>
          </Row>
        )}
      </div>

      {documentData.documentInfo?.business_cards && (
        <div className="coupon_businessCards">
          <p>··· E N D ···</p>
          <Image
            preview={false}
            width="100%"
            src={documentData.documentInfo.business_img}
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
export default Documents;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
