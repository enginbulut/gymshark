import { FunctionComponent, useState } from "react";
import DateHelper from "@/helpers/DateHelper";
import { Button } from "antd";
import OrderItemsList from "../OrderItemsList";
import useOrder from "@/hooks/useOrder";

interface OrderCardProps {
  id: number;
  createdAt: string;
  purchasedItemCount: number;
  requestedItemCount: number;
  userFullName: string;
  userId: number;
}

const OrderCard: FunctionComponent<OrderCardProps> = (props) => {
  const [showItems, setShowItems] = useState(false);
  const { orderItems, orderItemsQuery } = useOrder(undefined, props.id);

  const onFetchItems = () => {
    setShowItems(!showItems);
  };

  return (
    <li className="flex w-full flex-col rounded-lg bg-slate-100 p-5 space-y-5 shadow-md">
      <div className="flex items-center justify-between">
        <span className="link text-lg font-bold">Order #{props.id}</span>
        <p className="rounded-lg bg-gray-200 shadow-lg cursor-default p-1 px-2 text-sm text-black font-bold">
          {DateHelper.format(props.createdAt)}
        </p>
      </div>

      <div className="flex flex-1 justify-between">
        <div className="flex flex-1 flex-col items-center border-r-2 border-dashed border-gray-300 pt-1">
          <p className="text-lg text-black">Purchased Item Count</p>
          <p className="text-xl font-bold text-black">
            {props.purchasedItemCount}
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center border-r-2 border-dashed border-gray-300 pt-1">
          <p className="text-lg text-black">Requested Item Count</p>
          <p className="text-xl font-bold text-black">
            {props.requestedItemCount}
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center pt-1">
          <p className="text-lg text-black">User</p>
          <p className="text-xl font-bold text-black">{props.userFullName}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="dashed" onClick={onFetchItems}>
          {showItems ? "Hide" : "Show"} Items
        </Button>
      </div>

      <div className={showItems ? "block" : "hidden"}>
        <OrderItemsList items={orderItems!} />
      </div>
    </li>
  );
};

export default OrderCard;
