import { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IOrderItem } from "@/interfaces/IOrder";

interface OrderItemsListProps {
  items: Array<IOrderItem>;
}

const OrderItemsList: FC<OrderItemsListProps> = (props) => {
  return (
    <>
      <h1 className="flex items-center justify-center text-2xl font-bold">
        Items
      </h1>
      <hr />
      <div className="col-span-3 flex w-full flex-col space-y-1">
        {props.items && props.items.length > 0 ? (
          <ul>
            {props.items.map((item, index) => (
              <div
                className="flex items-center border-b border-dashed py-2 space-x-3"
                key={index}
              >
                <div className="border border-neutral-300 shadow-md cursor-default w-8">
                  <p className="flex items-center justify-center font-semibold text-lg">
                    {item.quantity}
                  </p>
                </div>
                <XMarkIcon className="h-5 w-5" />
                <p className="flex items-center justify-center font-semibold text-lg">
                  {item.pack_size_name + ` (#${item.pack_size_id})`}
                </p>
              </div>
            ))}
          </ul>
        ) : (
          <h3 className="text-center">No items</h3>
        )}
      </div>
    </>
  );
};

export default OrderItemsList;
