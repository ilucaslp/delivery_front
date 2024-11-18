"use client";

import React from "react";
import { Layout as LayoutAntd, notification } from "antd";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Header from "./header";
import OfficeFinish from "../modal/office_finish";

const { Content } = LayoutAntd;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutAntd hasSider>
      <Sidebar />
      <LayoutAntd style={{ marginInlineStart: 200, height: "100vh" }}>
        <Header />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {children}
          <OfficeFinish />
        </Content>
        <Footer />
      </LayoutAntd>
    </LayoutAntd>
  );
};

export default Layout;
