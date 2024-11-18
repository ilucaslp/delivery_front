import { useAttendanceStore } from "@/store/attendances.store";
import { useDeliveryStore } from "@/store/deliveries.store";
import { Button, Drawer, Form, Input, Select, Skeleton, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { useOfficeStore } from "@/store/office.store";
import CurrencyInput from "react-currency-format";

const NewAttendance = () => {
  const { addAttendance } = useAttendanceStore();
  const { getDeliveryManSelect, loading } = useDeliveryStore();
  const { office } = useOfficeStore();
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [options, setOptions] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  const loadOptions = async () => {
    const resp = await getDeliveryManSelect();
    setOptions(resp);
  };

  useEffect(() => {
    loadOptions();
  }, [open]);

  const onFinish = (values: {
    code_order: string;
    delivery_id: number;
    payment_method: string;
    tax_order: number;
  }) => {
    try {
      if (office) {
        addAttendance({
          ...values,
          tax_order: value,
          office_id: office?.id,
        });
        setOpen(false);
        form.resetFields();
        setValue(0)
        api.success({
          message: "Acompanhamento adicionado com sucesso!",
        });
      } else {
        throw new Error(
          "Não foi possivel adicionar a entrega pois não há expediente em aberto"
        );
      }
    } catch (err) {
      api.error({
        message: "Ocorreu um erro ao adicionar o acompanhamento!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Tooltip
        title={
          office && office.opened !== 2
            ? "Você não pode adicionar um acompanhamento sem iniciar o expediente"
            : "Adicionar acompanhamento"
        }
      >
        <Button
          onClick={() => setOpen(true)}
          disabled={office && office.opened !== 2}
        >
          Adicionar Acompanhamento
        </Button>
      </Tooltip>
      <Drawer
        title="Novo acompanhamento"
        placement={"right"}
        closable={true}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        extra={<Button onClick={() => form.submit()}>Salvar</Button>}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name={"code_order"}
            label="Código do Pedido:"
            rules={[
              {
                required: true,
                message: "Por favor, digite o código do pedido!",
              },
            ]}
          >
            <Input placeholder="Digite o código do pedido" />
          </Form.Item>
          <Form.Item
            name={"delivery_id"}
            label="Entregador:"
            rules={[
              {
                required: true,
                message: "Por favor, selecione um entregador!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Selecione um entregador"
              optionFilterProp="label"
              notFoundContent={<>Sem entregadores</>}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={options}
              loading={loading}
            />
          </Form.Item>
          <Form.Item
            name={"payment_method"}
            label="Método de pagamento:"
            rules={[
              {
                required: true,
                message: "Por favor, selecione um método de pagamento!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Selecione um método de pagamento"
              optionFilterProp="label"
              notFoundContent={<>Sem métodos de pagamento</>}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  label: "PIX",
                  value: "PIX",
                },
                {
                  label: "Cartão de débito",
                  value: "DÉBITO",
                },
                {
                  label: "Cartão de crédito",
                  value: "CRÉDITO",
                },
              ]}
              loading={loading}
            />
          </Form.Item>
          <Form.Item
            name={"tax_order"}
            label="Taxa de entrega:"
            rules={[
              {
                required: true,
                message: "Por favor, digite a taxa de entrega!",
              },
            ]}
          >
            <CurrencyInput
              className="ant-input css-dev-only-do-not-override-49qm ant-input-outlined"
              prefix="R$ "
              value={value}
              placeholder={"Digite a taxa de entrega"}
              decimalSeparator=","
              allowNegative={false}
              onValueChange={(values) => {
                setValue(values.floatValue);
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default NewAttendance;
