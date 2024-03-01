/**
 * @file
 * @date 2023-12-08
 * @author haodong.wang
 * @lastModify  2023-12-08
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
import { Select, SelectProps, Spin, Typography } from "antd";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface ScrollLoadSelectPorps
  extends Omit<SelectProps, "onPopupScroll" | "dropdownRender"> {
  total: number;
  pageSize?: number;
  maxMessage?: string;
  fetchOptions: () => void;
}

const { Text } = Typography;
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const ScrollLoadSelect: React.FC<ScrollLoadSelectPorps> = ({
  total,
  pageSize = 10,
  maxMessage = "没有更多数据了",
  fetchOptions,
  ...props
}): JSX.Element => {
  /* <------------------------------------ **** STATE START **** ------------------------------------ */
  /************* This section will include this component HOOK function *************/
  const { options } = props;

  const [fetching, setFetching] = useState(false);
  const [isScrollLast, setIsScrollLast] = useState(false);
  /* <------------------------------------ **** STATE END **** ------------------------------------ */
  /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
  const isMax = options?.length >= total;
  const isDataEmpty = options?.length === 0;
  /************* This section will include this component parameter *************/
  /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
  /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
  /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
  useEffect(() => {
    if (!isDataEmpty) {
      setFetching(false);
      setIsScrollLast(false);
    }
  }, [options]);
  /************* This section will include this component general function *************/
  /* <------------------------------------ **** EFFECT END **** ------------------------------------ */
  return (
    <Select
      {...props}
      onPopupScroll={(e) => {
        const { target }: { target: any } = e;
        // 判断是否滑动到底部 滚动条顶部距离 + 下拉栏展示高度 = 滚动总高度
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
          setIsScrollLast(true);
          // 滑动到底部实现分页加载逻辑
          if (isDataEmpty || isMax) return;
          setFetching(true);
          fetchOptions();
        } else {
          setIsScrollLast(false);
        }
      }}
      dropdownRender={(value) => {
        return (
          <>
            {value}
            {isScrollLast && !fetching && pageSize < total && (
              <Text
                type="secondary"
                style={{ fontSize: 12, textAlign: "center", display: "block" }}
              >
                {maxMessage}
              </Text>
            )}
            {fetching && <Spin size="small"></Spin>}
          </>
        );
      }}
    />
  );
};
export default ScrollLoadSelect;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
