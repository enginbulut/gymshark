import { ReactElement } from "react";
import Router from "next/router";
import Link from "next/link";
import { Button, Card, Form, Input } from "antd";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import useUser from "@/hooks/useUser";
import useDomLoaded from "@/hooks/useDomLoaded";
import useSession from "@/hooks/useSession";
import AlreadySignedIn from "@/components/Auth/AlreadySignedIn";
import MainLayout from "@/components/Layout/MainLayout";
import { NextPageWithLayout } from "../_app";

type RegisterFormParams = {
  full_name: string;
  email: string;
  password: string;
};

const Page: NextPageWithLayout = () => {
  const { signUpMutation } = useSession();
  const { userQuery } = useUser();

  const onSignUp = async (formParams: RegisterFormParams) => {
    try {
      await toast.promise(signUpMutation.mutateAsync({ body: formParams }), {
        error: ErrorHelper.parseApiError,
        loading: "Signing you up",
        success: "Signed up. Please login",
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
          title="Sign Up"
          className="w-full max-w-xl shadow-lg rounded-lg shadow-slate-400 relative"
        >
          <Form
            onChange={signUpMutation.reset}
            name="signup-form"
            disabled={userQuery.isFetching}
            labelCol={{ span: 5 }}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
            }}
            onFinish={onSignUp}
          >
            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input />
            </Form.Item>

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
                loading={signUpMutation.isLoading}
              >
                Register
              </Button>
            </Form.Item>
            {signUpMutation.error ? (
              <Form.ErrorList
                errors={[(signUpMutation.error as AxiosError).message]}
              />
            ) : null}
          </Form>

          <p className="flex justify-end space-x-0.5">
            <span>Already signed up?</span>
            <Link href="/login" className="underline hover:underline">
              Click to login
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
