import { useOfficeStore } from "@/store/office.store";
import { Button, Dropdown, Flex, Layout, Space } from "antd";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { MenuOutlined } from "@ant-design/icons";
import ConfigurationsModal from "../modal/configurations";

const { Header: HeaderAntd } = Layout;

const Header = () => {
  const { closeOffice, openOffice, loadOffice, loading, office } =
    useOfficeStore();

  useEffect(() => {
    loadOffice();
  }, []);

  return (
    <HeaderAntd style={{ display: "flex", alignItems: "center" }}>
      <Flex
        gap="middle"
        align={"center"}
        justify="space-between"
        style={{ width: "100%" }}
      >
        {office && (
          <Button
            ghost
            danger={office.opened === 2}
            onClick={() => {
              if (office.opened === 2) {
                closeOffice();
              } else if (office.opened === 1) {
                openOffice();
              }
            }}
            loading={loading}
          >
            {office.opened === 2 ? "Fechar expediente" : "Começar expediente"}
          </Button>
        )}
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <ConfigurationsModal />
                ),
                key: "0",
              },
              {
                label: (
                  <Button
                    variant="text"
                    shape="default"
                    onClick={() => {
                      sessionStorage.clear();
                      signOut();
                    }}
                  >
                    Sair
                  </Button>
                ),
                key: "1",
              },
            ],
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <MenuOutlined />
            </Space>
          </a>
        </Dropdown>
      </Flex>
    </HeaderAntd>
  );
};

export default Header;
