import Layout from "@/components/layout";
import Deliveries from "@/section/deliveries";

export const metadata = {
  title: "Entregadores",
};

export default function Home() {

  return (
    <Layout>
      <Deliveries />
    </Layout>
  );
}
