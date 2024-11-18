import { useAttendanceStore } from "@/store/attendances.store";
import { useDeliveryStore } from "@/store/deliveries.store";
import { Button, Drawer, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { notification } from "antd";

const NewDelivery: React.FC<{
  delivery?: DeliveryManItem;
  callBack: () => void;
}> = ({ delivery, callBack }) => {
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { addDelivery, loading, editDelivery } = useDeliveryStore();

  useEffect(() => {
    if (delivery) {
      setOpen(true);
      form.setFieldsValue({
        ...delivery,
        phone: delivery.phone.replace("+55", ""),
      });
    }
  }, [delivery]);

  const onFinish = (values: {
    name: string;
    phone: string;
    diary_value: string;
  }) => {
    try {
      if (delivery) {
        editDelivery({
          ...values,
          id: delivery.id,
          phone: `+55${values.phone}`,
          diary_value: Number(values.diary_value),
        });
        api.success({
          message: "Entregador atualizado com sucesso!",
        });
      } else {
        addDelivery({
          ...values,
          phone: `+55${values.phone}`,
          diary_value: Number(values.diary_value),
        });
        api.success({
          message: "Entregador adicionado com sucesso!",
        });
      }
      setOpen(false);
      form.resetFields();
    } catch (err) {
      api.error({
        message: "Ocorreu um erro ao adicionar o entregador!",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <Button onClick={() => setOpen(true)}>Adicionar Entregador</Button>
      <Drawer
        title={delivery ? "Editar entregador" : "Novo entregador"}
        placement={"right"}
        closable={true}
        onClose={() => {
          setOpen(false);
          if (delivery) {
            callBack();
            form.resetFields();
          }
        }}
        open={open}
        extra={
          <Button onClick={() => form.submit()} loading={loading}>
            Salvar
          </Button>
        }
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name={"name"}
            label="Nome do entregador:"
            rules={[
              {
                required: true,
                message: "Por favor, digite o nome do entregador!",
              },
            ]}
          >
            <Input placeholder="Digite o nome do entregador" />
          </Form.Item>
          <Form.Item
            name={"phone"}
            label="Telefone:"
            rules={[
              {
                required: true,
                message: "Por favor, digite o número de telefone!",
              },
            ]}
          >
            <Input prefix={"+55"} />
          </Form.Item>
          <Form.Item
            name={"diary_value"}
            label="Valor da diária:"
            rules={[
              {
                required: true,
                message: "Por favor, digite o valor da diária!",
              },
            ]}
          >
            <Input
              placeholder="Digite o valor da diária"
              type="number"
              prefix={"R$"}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default NewDelivery;
