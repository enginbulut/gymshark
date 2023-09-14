import { ReactElement } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Router from "next/router";
import { AxiosError } from "axios";
import { Button, Card, Form, Input } from "antd";
import ErrorHelper from "@/helpers/ErrorHelper";
import useUser from "@/hooks/useUser";
import useDomLoaded from "@/hooks/useDomLoaded";
import useSession from "@/hooks/useSession";
import MainLayout from "@/components/Layout/MainLayout";
import AlreadySignedIn from "@/components/Auth/AlreadySignedIn";
import { NextPageWithLayout } from "../_app";

type LoginFormParams = {
  email: string;
  password: string;
};

const Page: NextPageWithLayout = () => {
  const { loginMutation } = useSession();
  const { userQuery } = useUser();

  const onLogin = async (formParams: LoginFormParams) => {
    try {
      await toast.promise(loginMutation.mutateAsync({ body: formParams }), {
        error: ErrorHelper.parseApiError,
        loading: "Logging you in",
        success: "Welcome Back",
      });

      Router.push("/");
    } catch (error) {}
  };

  const { domLoaded } = useDomLoaded();
  if (!domLoaded) return null;

  return (
    <div className="flex justify-center items-center min-h-screen w-full py-24">
      {userQuery.isSuccess ? (
        <AlreadySignedIn />
      ) : (
        <Card
          title="Login"
          className="w-full max-w-xl shadow-lg rounded-lg shadow-slate-400 relative"
        >
          <Form
            onChange={loginMutation.reset}
            name="login-form"
            disabled={userQuery.isFetching}
            labelCol={{ span: 4 }}
            initialValues={{ email: "", password: "" }}
            onFinish={onLogin}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type={"email"} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="default"
                htmlType="submit"
                loading={loginMutation.isLoading}
              >
                Login
              </Button>
            </Form.Item>
            {loginMutation.error ? (
              <Form.ErrorList
                errors={[(loginMutation.error as AxiosError).message]}
              />
            ) : null}
          </Form>

          <p className="flex justify-end space-x-0.5">
            <span>Not signed up yet?</span>
            <Link href="/register" className="underline hover:underline">
              Click to register
            </Link>
          </p>
        </Card>
      )}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
