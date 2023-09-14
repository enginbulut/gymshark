import { Menu } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

interface SideMenuProps {}

const sideMenuItems = [
  {
    key: "home",
    href: "/",
    label: "Home",
  },
  {
    key: "pack_sizes",
    href: "/pack_sizes",
    label: "Pack Sizes",
  },
  {
    key: "orders",
    href: "/orders",
    label: "Orders",
  },
];

const SideMenu: FC<SideMenuProps> = (props) => {
  const router = useRouter();

  const sideMenuSelectedKeys = useMemo(
    () =>
      sideMenuItems
        .filter((item) => item.href === router.asPath)
        .map((navBarItem) => navBarItem.key.toString()),
    [router.asPath]
  );

  return (
    <aside className="flex flex-col bg-primary-background">
      <Menu mode="inline" selectedKeys={sideMenuSelectedKeys}>
        {sideMenuItems.map((item) => (
          <Menu.Item key={item.key}>
            <Link
              href={item.href}
              className={classNames(
                "no-underline !text-black font-bold hover:!text-opacity-100",
                sideMenuSelectedKeys.includes(item.key)
                  ? "!text-opacity-100"
                  : "!text-opacity-60"
              )}
            >
              {item.label}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </aside>
  );
};

export default SideMenu;
