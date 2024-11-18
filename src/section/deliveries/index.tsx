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
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useDeliveryStore } from "@/store/deliveries.store";
import NewDelivery from "./new_delivery";

type DataIndex = keyof DeliveryManItem;

const Deliveries = () => {
  const [api, contextHolder] = notification.useNotification();
  const { deliveries, loadDeliveries, loading, removeDelivery } =
    useDeliveryStore();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [editDelivery, setEditDelivery] = useState<DeliveryManItem>();
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
  ): TableColumnType<DeliveryManItem> => ({
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
              if (clearFilters) {
                clearFilters();
              }
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

  const columnsTable: ColumnsType<DeliveryManItem> = [
    {
      key: "0",
      dataIndex: "name",
      title: "Nome",
      ...getColumnSearchProps("name", "Nome do entregador"),
    },
    {
      key: "1",
      dataIndex: ["phone"],
      title: "Telefone",
      ...getColumnSearchProps("phone", "Telefone"),
    },
    {
      key: "2",
      dataIndex: "diary_value",
      title: "Valor da Diaria",
      ...getColumnSearchProps("diary_value", "Valor da Diaria"),
      render(value: number) {
        return value?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      key: "3",
      dataIndex: "id",
      title: "Ações",
      render(value: number, record) {
        return (
          <Flex wrap gap="small">
            <Button
              onClick={() => {
                setEditDelivery(record);
              }}
            >
              Editar
            </Button>
            <Popconfirm
              title={`Realmente deseja remover o entregador ${record.name}?`}
              onConfirm={() => {
                removeDelivery(value);
                setEditDelivery(undefined);
                api.success({
                  message: "Entregador removido com sucesso!",
                });
              }}
              cancelText={"Não"}
              okText={"Sim, desejo remover"}
            >
              <Button danger>Remover Entregador</Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  return (
    <>
      {contextHolder}
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Entregadores</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        style={{ width: "100%", height: "80vh" }}
        title="Entregadores"
        extra={
          <NewDelivery
            delivery={editDelivery}
            callBack={() => {
              setEditDelivery(undefined);
            }}
          />
        }
      >
        <Table
          columns={columnsTable}
          dataSource={deliveries}
          loading={loading}
          pagination={{ pageSize: 8 }}
          virtual
          locale={{ emptyText: "Nenhum dado disponível" }}
        />
      </Card>
    </>
  );
};

export default Deliveries;
