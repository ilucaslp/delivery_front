"use client";

import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, notification } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    if (createAccount) {
      const data = await fetch(`/api/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values),
      });
      if (data.ok) {
        api.success({
          message: `Usuário criado com sucesso!`,
        });
        setCreateAccount(false);
      } else {
        const resp = await data.json();
        api.error({
          message: resp.message,
        });
      }
    } else {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });

      if (result?.error) {
        console.error(result.error);
        api.error({
          message: `Credenciais inválidas`,
        });
      } else {
        api.success({
          message: `Login bem-sucedido!`,
        });
        router.push("/");
      }
    }
  };

  return (
    <ProConfigProvider dark>
      {contextHolder}
      <div
        style={{
          backgroundColor: "white",
          height: "100vh",
        }}
      >
        <LoginFormPage
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          logo="/logo.png"
          title="Gestor de entregas"
          subTitle=" "
          containerStyle={{
            backgroundColor: "rgba(0, 0, 0,0.65)",
            backdropFilter: "blur(4px)",
            fontFamily: "sans-serif",
          }}
          onFinish={handleSubmit}
          submitter={{
            render: ({ submit }) => (
              <Button
                size="large"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onClick={submit}
              >
                {createAccount ? "Criar conta" : "Entrar"}
              </Button>
            ),
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={"Digite seu usário"}
            rules={[
              {
                required: true,
                message: "Por favor digite o usuário!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"Digite sua senha"}
            rules={[
              {
                required: true,
                message: "Por favor digite sua senha!",
              },
            ]}
          />
          <a
            onClick={() => {
              setCreateAccount(!createAccount);
            }}
          >
            {createAccount
              ? "Já tem uma conta? Entre"
              : "Não tem uma conta? Registre-se"}
          </a>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
