import { FC } from "react";
import Link from "next/link";
import { Button, Card } from "antd";
import UserHelper from "@/helpers/UserHelper";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import useSession from "@/hooks/useSession";
import useUser from "@/hooks/useUser";

interface AlreadySignedInProps {}

const AlreadySignedIn: FC<AlreadySignedInProps> = (props) => {
  const { logoutMutation } = useSession();
  const { user } = useUser();

  const onLogout = () =>
    toast.promise(logoutMutation.mutateAsync(), {
      error: ErrorHelper.parseApiError,
      loading: "Logging out",
      success: "Logged out",
    });

  return (
    <Card className="w-full max-w-2xl shadow-sm relative">
      <div className="flex justify-between items-center">
        <p>Already signed in as {UserHelper.getDisplayName(user!)}</p>
        <div className="flex space-x-3">
          <Link href="/" passHref>
            <Button>Continue</Button>
          </Link>
          <Button onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </Card>
  );
};

export default AlreadySignedIn;
