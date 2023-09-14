import { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import Application from "@/components/Layout/Application";

const Page: NextPageWithLayout = () => {
  return (
    <div className="flex justify-center items-center mt-12">
      <h1 className="text-4xl select-none font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-light-accent to-dark-accent">
        WELCOME
      </h1>
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Authentication>
        <Application>{page}</Application>
      </Authentication>
    </MainLayout>
  );
};

export default Page;
