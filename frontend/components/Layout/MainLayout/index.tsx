import Head from "next/head";
import { FC, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = (props) => {
  return (
    <>
      <Head>
        <title>Pack</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <main>{props.children}</main>
    </>
  );
};

export default MainLayout;
