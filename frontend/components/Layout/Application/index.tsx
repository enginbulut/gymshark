import React, { FC, useMemo, ReactElement } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { Button, Result } from "antd";
import _ from "lodash";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import Header from "./Header";
import ErrorHelper from "@helpers/ErrorHelper";
import SideMenu from "./SideMenu";

interface ApplicationProps {
  children: ReactElement;
}

const FallbackComponent: React.ComponentType<FallbackProps> = (props) => {
  const router = useRouter();
  const onBack = () => router.back();

  const errorMessage = useMemo<string>(() => {
    // Check if is an axios error
    if ((props.error as AxiosError)?.isAxiosError) {
      return ErrorHelper.parseApiError(props.error as any);
    }

    // Check if is a graphql error
    if ((props.error as any)?.response?.errors?.length) {
      return ErrorHelper.parseApiError(props.error as any);
    }

    return typeof props.error === "string"
      ? props.error
      : props.error
      ? JSON.stringify(props.error)
      : "Unknown Error: Please Check Console";
  }, [props.error]);

  const extra = (
    <div className="flex space-x-3 justify-center items-center">
      <Button onClick={onBack} type="ghost">
        Go Back
      </Button>
      <Button onClick={props.resetErrorBoundary}>Refresh</Button>
    </div>
  );

  return <Result status="error" title={errorMessage} extra={extra} />;
};

const Application: FC<ApplicationProps> = (props) => {
  const { reset } = useQueryErrorResetBoundary();
  const onReset = () => reset();

  return (
    <div
      id="application-layout"
      className="transition-all duration-200 ease-in-out h-screen"
    >
      <Header />
      <SideMenu />
      <main>
        <div className="overflow-x-hidden w-full h-full overflow-y-auto px-4 py-2 flex flex-col">
          <ErrorBoundary
            FallbackComponent={FallbackComponent}
            onReset={onReset}
          >
            {props.children}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Application;
