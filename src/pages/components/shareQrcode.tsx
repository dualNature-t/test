/**
 * @file
 * @date 2024-01-16
 * @author haodong.wang
 * @lastModify  2024-01-16
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import style from "./style.module.scss";
import { EllipsisOutlined } from "@ant-design/icons";
import { Affix, Button, Popover, QRCode, Row, Typography } from "antd";
import { ShareOutlined } from "./icon";

const { Text } = Typography;
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const ShareQrcode = ({ isMobile = false }): JSX.Element => {
  /* <------------------------------------ **** STATE START **** ------------------------------------ */
  /************* This section will include this component HOOK function *************/
  /* <------------------------------------ **** STATE END **** ------------------------------------ */
  /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
  /************* This section will include this component parameter *************/
  /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
  /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
  /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** EFFECT END **** ------------------------------------ */
  return (
    <Popover
      trigger={isMobile ? "click" : "hover"}
      placement="rightTop"
      content={
        <div style={{ textAlign: "center" }}>
          <QRCode
            bordered={false}
            type="svg"
            value={window.location.href || ""}
          />
          <Text>微信扫码分享</Text>
        </div>
      }
    >
      <Row
        justify="center"
        style={
          isMobile
            ? { cursor: "pointer" }
            : {
                position: "fixed",
                top: 100,
                marginLeft: -80,
                boxShadow: "0 2px 4px 0 rgba(50,50,50,.04)",
                background: "#fff",
                borderRadius: "50%",
                width: 48,
                height: 48,
                cursor: "pointer",
              }
        }
      >
        {isMobile ? (
          <EllipsisOutlined style={{ fontSize: 22 }} />
        ) : (
          <ShareOutlined style={{ fontSize: 22 }}></ShareOutlined>
        )}
      </Row>
    </Popover>
  );
};
export default ShareQrcode;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
