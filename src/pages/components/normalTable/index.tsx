/**
 * @file
 * @date 2024-02-29
 * @author haodong.wang
 * @lastModify  2024-02-29
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./style.css";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  TableProps,
  theme,
} from "antd";
import {
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import IButton from "../iButton";
import deepClone from "../../../utils/deepClone";

const { useToken } = theme;
const { RangePicker } = DatePicker;
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface NormalTableProps extends TableProps<any> {
  normalTableStyle?: React.CSSProperties;
  selectedHeadContentRender?: () => React.ReactNode;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  extraFilterColumns?: any[];
  onRowSelectChange?: (selectedRowKeys: React.Key[]) => void;
  onFilterReset?: () => void;
  onFilterConfirm?: (value: any[]) => void;
  onSearchEnterPress?: (value: string) => void;
}

const defaultTotal = 500;
const defaultPageSize = 20;
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const NormalTable = forwardRef(
  (
    {
      normalTableStyle = {},
      pagination,
      extraFilterColumns = [],
      onRowSelectChange,
      selectedHeadContentRender,
      onFilterReset,
      onFilterConfirm,
      onSearchEnterPress,
      ...props
    }: NormalTableProps,
    ref
  ) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const { dataSource, scroll } = props;
    const columns = [...props.columns, ...extraFilterColumns].filter(
      (item) => item?.search ?? true
    );

    const { token } = useToken();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    // type 类型  key 表格key  title 表格标题  value 选中结果
    const [filterValue, setFilterValue] = useState([
      { type: "", key: "", title: "", value: "", enum: [] },
    ]);
    const [allreadyFilterCount, setAllreadyFilterCount] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const initFilterValue = useRef(null);
    const filterPopoverRef = useRef(null);
    const [currentPage, setCurrentPage] = useState({
      total: defaultTotal,
      page: 1,
      pageSize: defaultPageSize,
      ...pagination,
    });

    useImperativeHandle(ref, () => {
      return {
        // 清除search数据
        clearSearchValue: () => {
          setSearchValue("");
        },
        // 清除过滤数据
        clearFilterValue: () => {
          setFilterValue([initFilterValue.current]);
          setAllreadyFilterCount(0);
        },
      };
    });
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    // 页数变化
    const onPageChange = (page: number, pageSize: number) => {
      setCurrentPage({ ...currentPage, page, pageSize });
      pagination?.onChange?.(page, pageSize);
    };

    // 每一行选中
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      onRowSelectChange && onRowSelectChange(newSelectedRowKeys);
    };

    const handleKeySelectChange = (key: string, data, index) => {
      const { value, label, type, enum: enumValue } = data;
      const result = deepClone(filterValue);
      result.splice(index, 1, {
        key: value,
        title: label,
        type,
        value: "",
        enum: enumValue,
      });
      setFilterValue(result);
    };

    const handleValueSelectChange = (value: string, index) => {
      const result = deepClone(filterValue);
      result.splice(index, 1, { ...result[index], value });
      setFilterValue(result);
    };

    const handleAddFilter = () => {
      const result = columns.filter(
        (item) => !filterValue.some((c) => c.key === item.key)
      );
      const { key, title, valueType, valueEnum } = result[0];
      setFilterValue([
        ...filterValue,
        { key, title, value: "", type: valueType, enum: valueEnum },
      ]);
    };

    const handleDeleteFilter = (index: number) => {
      setFilterValue(filterValue.filter((item, i) => i !== index));
    };

    // 获取筛选值 options配置
    const getEnumValue = (type: string, enumValue?: any) => {
      if (!enumValue || type == "input") return "";

      if (type == "select") {
        // {xx: {text: xx}}
        return Object.keys(enumValue).map((key, index) => {
          return { value: key, label: enumValue[key].text };
        });
      }
    };

    const handleResetFilter = () => {
      onFilterReset && onFilterReset();
      setFilterValue([initFilterValue.current]);
      setAllreadyFilterCount(0);
      handleFilterCancel();
    };

    const handleFilterConfirm = () => {
      const result = filterValue.filter((item) => item.value);
      handleFilterCancel();
      if (result.length === 0) return;
      onFilterConfirm && onFilterConfirm(result);
      setAllreadyFilterCount(result.length);
    };

    const handleFilterCancel = () => {
      filterPopoverRef.current.closePopover();
    };

    // 获取筛选值的操作元素
    const getFilterValueElement = (
      { type, enum: valueEnums, value },
      index: number
    ) => {
      const options = getEnumValue(type, valueEnums);
      switch (type) {
        case "input":
          return (
            <Input
              value={value}
              style={{ width: "100%" }}
              onChange={(e) => handleValueSelectChange(e.target.value, index)}
            />
          );
        case "select":
          return (
            <Select
              style={{ width: "100%" }}
              value={value.value}
              options={options}
              onChange={(key, option) => {
                handleValueSelectChange(option, index);
              }}
            />
          );
        case "dateRange":
          return (
            <RangePicker
              value={value}
              style={{ width: "100%" }}
              onChange={(date, dateStr) => {
                handleValueSelectChange(date, index);
              }}
            />
          );
        default:
          return (
            <Input
              value={value}
              style={{ width: "100%" }}
              onChange={(e) => handleValueSelectChange(e.target.value, index)}
            />
          );
      }
    };

    const getJoinText = (type: string) => {
      if (type == "input") return "包含";
      if (type == "select") return "等于";
      if (type == "dateRange") return "介于";
    };

    const getFilterNode = () => {
      return (
        <>
          <Row style={{ marginTop: "8px" }}>
            {filterValue.map((item, index) => {
              return (
                <Col span={24} key={index}>
                  <Row
                    gutter={20}
                    align="middle"
                    style={{ height: 36, marginBottom: 16 }}
                  >
                    <Col style={{ width: 74, paddingLeft: 20 }}>
                      {index == 0 ? "当" : "且"}
                    </Col>
                    <Col style={{ flex: 1 }}>
                      <Row gutter={20} align="middle">
                        <Col style={{ width: 130 }}>
                          <Select
                            style={{ width: "100%" }}
                            value={item.key}
                            onChange={(key, value) => {
                              handleKeySelectChange(key, value, index);
                            }}
                            options={columns
                              .map((child) => {
                                return child?.search ?? true
                                  ? {
                                      value: child.key,
                                      label: child.title,
                                      type: child?.valueType ?? "input",
                                      enum: child?.valueEnum,
                                      disabled: filterValue.some(
                                        (f) => f.key == child.key
                                      ),
                                    }
                                  : undefined;
                              })
                              .filter((child) => child !== undefined)}
                          />
                        </Col>
                        <Col style={{ width: 60, textAlign: "center" }}>
                          {getJoinText(item.type)}
                        </Col>
                        <Col style={{ flex: 1 }}>
                          {getFilterValueElement(item, index)}
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteFilter(index)}
                      />
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>

          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={handleAddFilter}
            disabled={filterValue.length >= columns?.length}
          >
            新增筛选条件
          </Button>

          <Row align="middle" justify="space-between">
            <Col>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={handleResetFilter}
              >
                重置
              </Button>
            </Col>
            <Col>
              <Row gutter={10}>
                <Col>
                  <Button type="text" onClick={handleFilterCancel}>
                    取消
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={handleFilterConfirm}>
                    确定
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      );
    };
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    /* <------------------------------------ **** EFFECT START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    useEffect(() => {
      const { key, title, valueType, valueEnum } = columns[0];

      const resultValueType = valueType ?? "input";
      const result = {
        key,
        title,
        value: "",
        type: resultValueType,
        enum: valueEnum,
      };
      initFilterValue.current = result;
      setFilterValue([result]);
    }, []);

    useEffect(() => {
      setCurrentPage({
        total: defaultTotal,
        page: 1,
        pageSize: defaultPageSize,
        ...pagination,
      });
    }, [pagination]);
    /* <------------------------------------ **** EFFECT END **** ------------------------------------ */
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return (
      <div className="normalTable_container" style={normalTableStyle}>
        <Table
          {...props}
          bordered
          pagination={false}
          scroll={{
            ...scroll,
            scrollToFirstRowOnChange: true,
            y: (scroll?.y as number) - 157,
          }}
          rowSelection={rowSelection}
          title={() => (
            <Row className="normalTable_header" align="middle">
              <Col
                style={{
                  borderRight: `1px solid ${token.colorBorderSecondary}`,
                  marginRight: 15,
                }}
              >
                <Input
                  value={searchValue}
                  style={{ border: "none" }}
                  addonBefore={
                    <SearchOutlined
                      style={{
                        marginRight: -15,
                        marginTop: 2,
                        color: token.colorTextDescription,
                      }}
                    />
                  }
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="搜索"
                  bordered={false}
                  onPressEnter={(e) => {
                    onSearchEnterPress && onSearchEnterPress(e.target.value);
                  }}
                />
              </Col>
              <Col onClick={(e) => e.stopPropagation()}>
                <IButton
                  ref={filterPopoverRef}
                  popoverTitle="筛选"
                  popoverNode={getFilterNode()}
                  overlayStyle={{ width: 700 }}
                  overlayInnerStyle={{ padding: "16px 24px 10px" }}
                >
                  <FilterOutlined style={{ marginRight: 4 }} />
                  筛选
                  {allreadyFilterCount > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: 4,
                        padding: "0 4px",
                        borderRadius: 10,
                        background: token.colorPrimaryBg,
                        color: token.colorPrimary,
                      }}
                    >
                      {allreadyFilterCount}
                    </span>
                  )}
                </IButton>
              </Col>
            </Row>
          )}
          footer={() => (
            <Row
              className="normalTable_footer"
              style={{
                background: token.colorBgBase,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
              }}
              justify="space-between"
              align="middle"
            >
              <Col>
                <Row gutter={20} style={{ color: token.colorTextDescription }}>
                  {dataSource?.length > 0 && (
                    <Col>
                      第
                      <span style={{ color: token.colorText, margin: "0 4px" }}>
                        {(currentPage.page - 1) * currentPage.pageSize + 1} -
                        {currentPage.page * currentPage.pageSize >
                        currentPage.total
                          ? currentPage.total
                          : currentPage.page * currentPage.pageSize}
                      </span>
                      条
                    </Col>
                  )}

                  <Col>
                    共
                    <span style={{ color: token.colorText, margin: "0 4px" }}>
                      {currentPage.total}
                    </span>
                    条
                  </Col>
                </Row>
              </Col>
              <Col>
                <Pagination
                  {...{
                    [pagination?.page ? "current" : ""]: currentPage.page ?? 1,
                  }}
                  total={currentPage?.total ?? defaultTotal}
                  pageSize={currentPage?.pageSize ?? defaultPageSize}
                  showSizeChanger={false}
                  onChange={onPageChange}
                />
              </Col>
            </Row>
          )}
        ></Table>

        {/* 选中头部 */}
        {selectedRowKeys.length > 0 && (
          <Row
            className="normalTable_selectHeader"
            style={{ background: token.colorBgBase }}
            align="middle"
            justify="space-between"
          >
            <Col>
              已选中{" "}
              <span style={{ color: token.colorPrimary }}>
                {selectedRowKeys.length}
              </span>{" "}
              项
            </Col>
            <Col
              style={{
                flex: 1,
                borderLeft: `1px solid ${token.colorBorderSecondary}`,
                marginLeft: 15,
                paddingLeft: 15,
              }}
            >
              {selectedHeadContentRender && selectedHeadContentRender()}
            </Col>
            <Col
              style={{ cursor: "pointer", color: token.colorTextDescription }}
              onClick={() => onSelectChange([])}
            >
              取消选择
            </Col>
          </Row>
        )}
      </div>
    );
  }
);

export default NormalTable;
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
