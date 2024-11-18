import { Button, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import jsonToCsvExport from "json-to-csv-export";

const OfficeFinishHistory: React.FC<{
  office: OfficeItem;
  attendances: AttendanceItem[];
}> = ({ office, attendances }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<
    (DeliveryManItem & { attendances: AttendanceItem[] })[]
  >([]);
  const generateDataReport = () => {
    setData(
      attendances.reduce((p, v) => {
        const hasDeliveryMan = p.find((man) => {
          return v.delivery && man.id === v.delivery.id;
        });

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
    if (attendances.length > 0) {
      generateDataReport();
    }
    // eslint-disable react-hooks/exhaustive-deps
  }, [open]);

  const getTaxes = (records: AttendanceItem[]) => {
    return records.reduce(
      (p, v) =>
        p + (v.tax_delivery < 4 ? office.price_tax_default : v.tax_delivery),
      0
    );
  };
  return (
    <>
      <Tooltip title={!office.closed_at ? "Você não pode exportar o expediente que ainda não foi fechado" : "Exportar expediente"}>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          disabled={!office.closed_at}
        >
          Exportar Expediente
        </Button>
      </Tooltip>
      <Modal
        title={
          <span style={{ textAlign: "center" }}>Expediente Finalizado!</span>
        }
        centered
        open={open}
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
              });
            }
            setOpen(false);
          }
        }}
        okText={"Baixar relatório"}
        onClose={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false)
        }}
        cancelText={"Cancelar"}
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
    </>
  );
};

export default OfficeFinishHistory;
