import { Layout } from "antd";
import React from "react";
const { Footer: FooterAntd } = Layout;

const Footer = () => {
  return (
    <FooterAntd style={{ textAlign: "center" }}>
      Lucas ©{new Date().getFullYear()}
    </FooterAntd>
  );
};

export default Footer;
