"use client";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};
const ItemsMenu = [
  {
    label: "Acompanhamento",
    key: "/",
    target: "/",
  },
  {
    label: "Entregadores",
    key: "/deliveries",
  },
  {
    label: "Histórico",
    key: "/history"
  }
];

const Sidebar = () => {
  const [defaultActiveKey, setDefaultActiveKey] = useState<string>();

  useEffect(() => {
    if(window){
        setDefaultActiveKey(window.location.pathname);
    }
  }, []);
  const router = useRouter();

  return (
    <Sider style={siderStyle}>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Image src={"/logo.png"} width={75} height={75} alt="" />
      </div>
      <Menu
        theme="dark"
        mode="vertical"
        items={ItemsMenu}
        selectedKeys={[defaultActiveKey as ""]}
        onSelect={({ key }) => {
          router.push(key);
        }}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
