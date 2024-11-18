import { useAttendanceStore } from "@/store/attendances.store";
import { useOfficeStore } from "@/store/office.store";
import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import jsonToCsvExport from "json-to-csv-export";
import moment from "moment";

const OfficeFinish = () => {
  const { finished, setFinished, office } = useOfficeStore();
  const { attendances, loadAttendances } = useAttendanceStore();
  const [data, setData] = useState<
    (DeliveryManItem & { attendances: AttendanceItem[] })[]
  >([]);
  const generateDataReport = () => {
    setData(
      attendances.reduce((p, v) => {
        const hasDeliveryMan = p.find((man) => man.id === v.delivery.id);

        if (hasDeliveryMan) {
          return p.map((deliveries) => {
            if (deliveries.id === v.delivery.id) {
              // @ts-expect-error removido porque não é necessário
              delete v.delivery;

              deliveries.attendances.push(v);
            }
            return deliveries;
          });
        } else {
          let deliveryMan = v.delivery;
          // @ts-expect-error removido porque não é necessário
          delete v.delivery;

          if (!deliveryMan) {
            deliveryMan = {
              created_at: new Date(),
              diary_value: 0,
              id: 999,
              name: "Sem entregador",
              phone: "",
              updated_at: new Date(),
            };
          }

          p.push({
            ...deliveryMan,
            attendances: [v],
          });
        }
        return p;
      }, [] as Array<DeliveryManItem & { attendances: AttendanceItem[] }>)
    );
  };
  useEffect(() => {
    if (finished) {
      generateDataReport();
    }
    // eslint-disable react-hooks/exhaustive-deps
  }, [finished]);

  const getTaxes = (records: AttendanceItem[]) => {
    const defaultValue = office ? office.price_tax_default : 4
    return records.reduce(
      (p, v) => p + (v.tax_delivery < defaultValue ? defaultValue : v.tax_delivery),
      0
    );
  };
  return (
    <Modal
      title={
        <span style={{ textAlign: "center" }}>Expediente Finalizado!</span>
      }
      centered
      open={finished}
      closable={false}
      onOk={() => {
        if (office) {
          if (data.length > 0) {
            jsonToCsvExport({
              data: data.map((item) => {
                return {
                  Nome: item.name,
                  Entregas: item.attendances.length,
                  Diária: item.diary_value,
                  Total: item.diary_value + getTaxes(item.attendances),
                };
              }),
              filename: `${moment().format("DD-MM-YYYY HHmmss")}.csv`
            });
          }
          loadAttendances(office);
          setFinished(false);
        }
      }}
      okText={"Concluir expediente"}
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
    >
      <Table
        columns={[
          { key: "1", dataIndex: "name", title: "Nome" },
          {
            key: "2",
            dataIndex: "attendances",
            title: "Entregas",
            render(_, record) {
              return record.attendances.length;
            },
          },
          {
            key: "2",
            dataIndex: "attendances",
            title: "Taxas",
            render(_, record) {
              return getTaxes(record.attendances).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
          {
            key: "3",
            dataIndex: "diary_value",
            title: "Diária",
            render(value) {
              return value?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });
            },
          },
          {
            key: "4",
            dataIndex: "diary_value",
            title: "Total",
            render(value, record) {
              return (value + getTaxes(record.attendances)).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              );
            },
          },
        ]}
        dataSource={data}
        pagination={{ pageSize: 8 }}
        virtual
        locale={{ emptyText: "Nenhum dado disponível" }} 
      />
    </Modal>
  );
};

export default OfficeFinish;
