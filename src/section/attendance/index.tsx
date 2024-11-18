"use client";

import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  InputRef,
  notification,
  Popconfirm,
  Space,
  Table,
  TableColumnType,
  theme,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";
import NewAttendance from "./new_attendance";
import { useAttendanceStore } from "@/store/attendances.store";
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useOfficeStore } from "@/store/office.store";

type DataIndex = keyof AttendanceItem;

const Attendance = () => {
  const [api, contextHolder] = notification.useNotification();
  const { office } = useOfficeStore();
  const { attendances, loadAttendances, updateAttendance, loading } =
    useAttendanceStore();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    name: string
  ): TableColumnType<AttendanceItem> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Procurar por ${name}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Procurar
          </Button>
          <Button
            onClick={() => {
              if (clearFilters) clearFilters();
              handleSearch([], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Resetar
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record && dataIndex) {
        const recordValue = record[dataIndex];
        if (recordValue) {
          return recordValue
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase());
        }
      }
      return false;
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columnsTable: ColumnsType<AttendanceItem> = [
    {
      key: "0",
      dataIndex: "code_order",
      title: "Código do pedido",
      ...getColumnSearchProps("code_order", "código do pedido"),
    },
    {
      key: "1",
      dataIndex: ["delivery", "name"],
      title: "Entregador",
    },
    {
      key: "2",
      dataIndex: "payment_method",
      title: "Método de pagamento",
    },
    {
      key: "2",
      dataIndex: "status",
      title: "Status",
      sorter: (a, b) => a.status < b.status ? 1 : 0,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      render(value: number) {
        switch (value) {
          case 1:
            return "EM ROTA";
          case 2:
            return "ENTREGUE";
          case 3:
            return "CANCELADO";
        }
      },
    },
    {
      key: "3",
      dataIndex: "tax_delivery",
      title: "Taxa de entrega",
      render(value: number) {
        return (value ?? 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      key: "4",
      dataIndex: "id",
      title: "Ações",
      render(value: number, record) {
        if (office && record) {
          return (
            record.status !== 2 &&
            record.status !== 3 && (
              <Flex wrap gap="small">
                <Button
                  onClick={() => {
                    updateAttendance(office?.id, value, 2).then((data) => {
                      if (data.status) {
                        api.success({
                          message: data.message,
                        });
                      } else {
                        api.error({
                          message: data.message,
                        });
                      }
                    });
                  }}
                >
                  Confirmar Entrega
                </Button>
                <Popconfirm
                  title={`Realmente deseja cancelar a entrega #${record.code_order}?`}
                  onConfirm={() => {
                    updateAttendance(office?.id, value, 3).then((data) => {
                      if (data.status) {
                        api.success({
                          message: data.message,
                        });
                      } else {
                        api.error({
                          message: data.message,
                        });
                      }
                    });
                  }}
                  cancelText={"Não"}
                  okText={"Sim, desejo cancelar"}
                >
                  <Button danger>Cancelar Entrega</Button>
                </Popconfirm>
              </Flex>
            )
          );
        } else {
          return "";
        }
      },
    },
  ];

  useEffect(() => {
    if (office) loadAttendances(office);
  }, [office]);

  return (
    <>
      {contextHolder}
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Acompanhamento</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        style={{ width: "100%", height: "80vh" }}
        title="Acompanhamento"
        extra={<NewAttendance />}
      >
        <Table
          columns={columnsTable}
          dataSource={attendances}
          loading={loading}
          pagination={{ pageSize: 8 }}
          virtual
          locale={{ emptyText: "Nenhum dado disponível" }}
        />
      </Card>
    </>
  );
};

export default Attendance;
