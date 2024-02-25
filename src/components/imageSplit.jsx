import { useState, useRef, useEffect } from "react";
import { Row, Col, Slider, Button, Radio, Modal } from "antd";
import "./style.css";

const ratio = 2.5;
const wrapperWidth = 400;

const initAreaSize = {
  x: 0,
  y: 0,
  width: wrapperWidth,
  height: wrapperWidth / ratio,
};

function base64ToFile(base64, filename) {
  var arr = base64.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const ImageSplit = ({ src, onOk }) => {
  const [modalOpen, setModalOpen] = useState(false);
  // square 正方形  rect 长方形
  const [areaShape, setAreaShape] = useState("rect");
  const [areaSize, setAreaSize] = useState(initAreaSize);
  const [srcSourceRect, setSrcSourceRect] = useState({
    width: 0,
    height: 0,
  });

  const wrapperRef = useRef(null);
  const areaRef = useRef(null);

  // 上传图片宽度是否大于高度
  const isNormalSize = srcSourceRect.width >= srcSourceRect.height;

  useEffect(() => {
    const areadom = areaRef.current;
    let rect = {
      wrapperX: 0,
      wrapperY: 0,
      wrapperWidth: 0,
      wrapperHeihgt: 0,
      areaX: 0,
      areaY: 0,
      areaWidth: 0,
      areaHeight: 0,
      pointX: 0,
      pointY: 0,
    };

    const mouseMoveFn = (e) => {
      const {
        wrapperX,
        wrapperY,
        wrapperWidth,
        wrapperHeihgt,
        areaX,
        areaY,
        areaWidth,
        areaHeight,
        pointX,
        pointY,
      } = rect;
      const { pageX, pageY } = e;

      let x = pageX - wrapperX - pointX;
      let y = pageY - wrapperY - pointY;

      if (x < 0) x = 0;
      if (x > wrapperWidth - areaWidth) x = wrapperWidth - areaWidth;
      if (y < 0) y = 0;
      if (y > wrapperHeihgt - areaHeight) y = wrapperHeihgt - areaHeight;

      setAreaSize((before) => {
        return { ...before, x, y };
      });
    };

    const mouseUpFn = () => {
      document.removeEventListener("mousemove", mouseMoveFn, false);
      document.removeEventListener("mouseup", mouseUpFn, false);
    };

    const mouseDownFn = (e) => {
      const {
        x: wrapperX,
        y: wrapperY,
        width: wrapperWidth,
        height: wrapperHeihgt,
      } = wrapperRef.current.getBoundingClientRect();
      const {
        x: areaX,
        y: areaY,
        width: areaWidth,
        height: areaHeight,
      } = areaRef.current.getBoundingClientRect();
      const { offsetX, offsetY } = e;

      rect = {
        wrapperX,
        wrapperY,
        wrapperWidth,
        wrapperHeihgt,
        areaX,
        areaY,
        areaWidth,
        areaHeight,
        pointX: offsetX,
        pointY: offsetY,
      };

      document.addEventListener("mousemove", mouseMoveFn, false);
      document.addEventListener("mouseup", mouseUpFn, false);
    };

    if (areadom) {
      areadom.addEventListener("mousedown", mouseDownFn, false);
    }

    return () => {
      areadom?.removeEventListener("mousedown", mouseDownFn, false);
    };
  }, [areaRef.current]);

  useEffect(() => {
    if (src) {
      setModalOpen(true);
      const img = new Image();
      img.onload = () => {
        setSrcSourceRect({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = src;
    }
    setAreaSize(initAreaSize);
    setAreaShape("rect");
  }, [src, onOk]);

  const handleConfirm = () => {
    const { x, y, width, height } = areaSize;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = function () {
      const pix =
        (isNormalSize ? img.naturalWidth : img.naturalHeight) / wrapperWidth;

      ctx.drawImage(
        img,
        x * pix,
        y * pix,
        width * pix,
        height * pix,
        0,
        0,
        width,
        height
      );
      var dataURL = canvas.toDataURL("image/jpeg", 1);

      onOk(base64ToFile(dataURL, "test.jpeg"), () => {
        setModalOpen(false);
      });
    };
    img.src = src;
  };

  return (
    <Modal
      title="图片切割"
      maskClosable={false}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      onOk={handleConfirm}
    >
      <div
        className="preview"
        ref={wrapperRef}
        style={isNormalSize ? {} : { height: wrapperWidth }}
      >
        <img
          src={src}
          className="preview_img"
          style={isNormalSize ? { width: "100%" } : { height: "100%" }}
        />
        <div
          className="splitArea"
          ref={areaRef}
          style={{
            width: areaSize.width,
            height: areaSize.height,
            border: "2px solid #f40",
            left: areaSize.x,
            top: areaSize.y,
          }}
        ></div>
      </div>

      <div className="slider">
        <Row gutter={10} align="middle">
          <Col>宽</Col>
          <Col style={{ flex: 1 }}>
            <Slider
              min={100}
              max={
                isNormalSize
                  ? areaShape == "rect"
                    ? wrapperWidth
                    : wrapperRef.current.clientHeight
                  : wrapperWidth
              }
              onChange={(value) => {
                setAreaSize({
                  x: 0,
                  y: 0,
                  width: value,
                  height: value / (areaShape == "rect" ? ratio : 1),
                });
              }}
              value={areaSize.width}
            />
          </Col>
        </Row>
      </div>

      <div className="shaper">
        <Row gutter={10}>
          <Col>比例</Col>
          <Col>
            <Radio.Group
              onChange={(e) => {
                const value = e.target.value;
                setAreaSize({
                  ...areaSize,
                  width: value == "rect" ? wrapperWidth : areaSize.height,
                  height:
                    value == "rect" ? wrapperWidth / ratio : areaSize.height,
                });
                setAreaShape(value);
              }}
              value={areaShape}
            >
              <Radio value="rect">{ratio}:1</Radio>
              <Radio value="square">1:1</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ImageSplit;
