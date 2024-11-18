"use client";

import OfficeFinishHistory from "@/components/modal/office_finish_history";
import { useOfficeStore } from "@/store/office.store";
import { SearchOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Flex,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { FilterDropdownProps } from "antd/lib/table/interface";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

type DataIndex = keyof OfficeItem;

const HistorySection = () => {
  const { office } = useOfficeStore();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<OfficeItem[]>([]);
  useEffect(() => {
    loadDataSource();
  }, [office]);

  const loadDataSource = async () => {
    setLoading(true);
    const resp = await fetch(`/api/office/all`);
    const data = await resp.json();
    setDataSource(data.data);
    setLoading(false);
  };
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
  ): TableColumnType<OfficeItem> => ({
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

  const columnsTable: ColumnsType<OfficeItem> = [
    {
      key: "0",
      dataIndex: "id",
      title: "N° Expediente",
      ...getColumnSearchProps("id", "Número do expediente"),
    },
    {
      key: "1",
      dataIndex: ["opened"],
      title: "Status",
      render(value: number) {
        switch (value) {
          case 1:
            return "EM ESPERA";
          case 2:
            return "ABERTO";
          case 3:
            return "FECHADO";
        }
      },
    },
    {
      key: "2",
      dataIndex: "opened_at",
      title: "Data de abertura",
      render(value: string) {
        return value ? moment(value).format("DD/MM/YYYY HH:mm:ss") : '';
      },
    },
    {
      key: "3",
      dataIndex: "closed_at",
      title: "Data de fechamento",
      render(value: string) {
        return value ? moment(value).format("DD/MM/YYYY HH:mm:ss") : '';
      },
    },

    {
      key: "4",
      dataIndex: "created_at",
      title: "Data de criação",
      render(value: string) {
        return moment(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      key: "5",
      dataIndex: "id",
      title: "Ações",
      render(value: number, record) {
        return (
          <Flex wrap gap="small">
            <OfficeFinishHistory
              office={record}
              attendances={record.attendances ?? []}
            />
          </Flex>
        );
      },
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Histórico</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ width: "100%", height: "80vh" }} title="Histórico">
        <Table
          columns={columnsTable}
          dataSource={dataSource}
          loading={loading}
          pagination={{ pageSize: 8 }}
          virtual
          locale={{ emptyText: "Nenhum dado disponível" }}
        />
      </Card>
    </>
  );
};

export default HistorySection;
