import Layout from "@/components/layout";
import Attendance from "@/section/attendance";

export const metadata = {
  title: "Acompanhamentos",
};

export default function Home() {

  return (
    <Layout>
      <Attendance />
    </Layout>
  );
}
