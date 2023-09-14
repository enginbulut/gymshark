import { FC, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { Button, Result } from "antd";
import useUser from "@/hooks/useUser";
import FullPageSpinner from "@/components/Shared/FullPageSpinner";

interface AuthenticationProps {
  children: ReactElement;
}

const AUTHENTICATION_SUB_ERROR =
  "Please make sure you are connected to the internet.";

const AuthenticationErrorExtra: FC<{
  onRetry?: () => void;
}> = (props) => {
  return (
    <div className="flex items-center justify-center space-x-3">
      {props.onRetry !== undefined ? (
        <Button onClick={props.onRetry} type="default">
          Refresh
        </Button>
      ) : null}
    </div>
  );
};

const Authentication: FC<AuthenticationProps> = (props) => {
  const router = useRouter();
  const { userQuery } = useUser();
  const onRetry = () => userQuery.refetch();

  useEffect(() => {
    if ((userQuery.error as AxiosError)?.response?.status === 401) {
      router.push("/login");
    }
  }, [userQuery.error, router]);

  return userQuery.status === "success" ? (
    props.children
  ) : userQuery.status === "loading" ||
    (userQuery.error as AxiosError)?.response?.status === 401 ? (
    <FullPageSpinner />
  ) : (
    <Result
      status="error"
      title={(userQuery.error as AxiosError).message}
      subTitle={AUTHENTICATION_SUB_ERROR}
      extra={<AuthenticationErrorExtra onRetry={onRetry} />}
    />
  );
};

export default Authentication;
