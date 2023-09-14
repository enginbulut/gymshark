import { FC } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import UserHelper from "@/helpers/UserHelper";
import ErrorHelper from "@/helpers/ErrorHelper";
import useUser from "@/hooks/useUser";
import useSession from "@/hooks/useSession";

interface HeaderProps {}

const Header: FC<HeaderProps> = (props) => {
  const { user } = useUser();
  const router = useRouter();

  const { logoutMutation } = useSession();
  const onLogout = async () => {
    router.push("/login");
    await toast.promise(logoutMutation.mutateAsync(), {
      error: ErrorHelper.parseApiError,
      loading: "Logging out",
      success: "Logged out",
    });
  };

  const menu = {
    items: [
      {
        key: "1",
        icon: <LogoutOutlined />,
        onClick: onLogout,
        label: "Logout",
      },
    ],
  };

  return (
    <header className="bg-blue-500 flex items-center justify-between">
      <div className="h-12 w-16 flex p-2 box-border items-center">
        <Link href="/" passHref className="relative h-full w-full">
          <Image
            fill
            src="/icon.svg"
            alt="next logo"
            className="object-contain object-center"
          />
        </Link>
      </div>
      <div className="flex items-center px-2">
        <div className="flex items-center space-x-3">
          <Dropdown trigger={"click" as any} menu={menu}>
            <div className="flex space-x-3 h-10 cursor-pointer items-center group">
              <span className="text-base font-normal group-hover:underline">
                {user ? UserHelper.getDisplayName(user) : "N/A"}
              </span>
              <Avatar
                shape="circle"
                className="flex items-center justify-center"
                icon={<UserOutlined />}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
