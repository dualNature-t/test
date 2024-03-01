import React, { useEffect, useState } from "react";
import { Empty, Image, Row } from "antd";
import "../App.css";

const fakeDataUrl = `/api/cms/setting`;

const Member: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const target = JSON.parse(res.data.content).member.find(
          (item) => item.type === "uploadQrcode"
        );
        const result = target.checked && target.visibled ? target.children : [];
        setData(result);
      });
  }, []);

  const qrcodeImgIndex =
    data.length > 0 ? Math.floor(Math.random() * data.length) : 0;
  const imgUrl = data[qrcodeImgIndex]?.url;
  return (
    <Row
      style={{ height: "100vh", alignContent: "center" }}
      align="middle"
      justify="center"
    >
      {imgUrl ? (
        <>
          <Row justify={"center"}>
            <Image preview={false} width={150} src={imgUrl}></Image>
          </Row>
          <Row style={{ marginTop: 20 }} justify={"center"}>
            扫描二维码，添加专属联系人(分享复制至微信可打开)
          </Row>
        </>
      ) : (
        <Empty description="暂未上传二维码" />
      )}
    </Row>
  );
};

export default Member;
