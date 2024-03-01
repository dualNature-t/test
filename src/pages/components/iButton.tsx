/**
 * @file
 * @date 2024-03-01
 * @author haodong.wang
 * @lastModify  2024-03-01
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useHover } from "ahooks";
import { Popover, theme } from "antd";
import useGlobalClick from "../../utils/useGlobalClick";
const { useToken } = theme;
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface IButtonProps {
  children: React.ReactNode;
  popoverNode?: React.ReactNode;
  popoverTitle?: string;
  overlayStyle?: React.CSSProperties;
  overlayInnerStyle?: React.CSSProperties;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const IButton = forwardRef(
  (
    {
      children,
      popoverNode,
      popoverTitle = "",
      overlayStyle = {},
      overlayInnerStyle = {},
    }: IButtonProps,
    ref
  ) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const { token } = useToken();

    const [open, setOpen] = useState(false);
    const filterRef = useRef(null);
    const isHovering = useHover(filterRef);

    useImperativeHandle(ref, () => {
      return {
        closePopover: () => {
          setOpen(false);
        },
      };
    });

    useGlobalClick(() => {
      setOpen(false);
    });
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
    const hoverStyle = {
      color: token.colorPrimary,
      background: token.colorPrimaryBg,
    };

    return (
      <Popover
        open={open}
        overlayStyle={overlayStyle}
        overlayInnerStyle={overlayInnerStyle}
        placement="bottomLeft"
        arrow={false}
        content={popoverNode}
        title={popoverTitle}
        trigger="click"
      >
        <div
          onClick={() => setOpen(!open)}
          ref={filterRef}
          className="normalTable_filter"
          style={isHovering ? hoverStyle : open ? hoverStyle : {}}
        >
          {children}
        </div>
      </Popover>
    );
  }
);

export default IButton;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
