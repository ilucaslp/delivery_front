import { Button, Form, Input, Modal, notification, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/store/office.store";
import CurrencyInput from "react-currency-format";

const ConfigurationsModal = () => {
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const { office, updateOffice } = useOfficeStore();
  const [value, setValue] = useState(0);
  const [form] = Form.useForm();

  const onFinish = (values: { price_tax_default: string }) => {
    try {
      if (office) {
        updateOffice(value);
        setOpen(false);
        form.resetFields();
        setValue(0);
        api.success({
          message: "Alteração realizada com sucesso!",
        });
      } else {
        throw new Error(
          "Não foi possivel realizar a alteração, contate o suporte"
        );
      }
    } catch (err) {
      api.error({
        message: "Ocorreu um erro ao atualizar, contate o suporte!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        variant="text"
        onClick={() => {
          setOpen(true);
        }}
      >
        Configurações
      </Button>
      <Modal
        title={
          <span style={{ textAlign: "center" }}>Configurações Gerais</span>
        }
        centered
        open={open}
        onOk={() => {
          form.submit();
          setOpen(false);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false)
        }}
        okText={"Salvar"}
        cancelText={"Cancelar"}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name={"price_tax_default"}
            label={`Taxa do entregador: Valor Atual (${office?.price_tax_default.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )})`}
            rules={[
              {
                required: true,
                message: "Por favor, digite a taxa do entregador!",
              },
            ]}
          >
            <CurrencyInput
              prefix="R$ "
              customInput={Input}
              value={value}
              defaultValue={office?.price_tax_default}
              placeholder={"Digite a taxa do entregador"}
              decimalSeparator=","
              allowNegative={false}
              className="ant-input css-dev-only-do-not-override-49qm"
              onValueChange={(values) => {
                setValue(values.floatValue);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ConfigurationsModal;
