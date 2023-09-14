import { FunctionComponent, MouseEventHandler } from "react";
import DateHelper from "@/helpers/DateHelper";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useUser from "@/hooks/useUser";

interface PackSizeCardProps {
  id: number;
  name: string;
  quantity: number;
  createdAt: string;
  onUpdate: MouseEventHandler<HTMLElement>;
  onRemove: MouseEventHandler<HTMLElement>;
}

const PackSizeCard: FunctionComponent<PackSizeCardProps> = (props) => {
  const { isAdmin } = useUser();

  return (
    <div className="list-none mx-5 rounded-lg bg-slate-100 p-5 space-y-5 shadow-md">
      <div className="flex items-center justify-between">
        <span className="link text-lg font-bold">Pack Size #{props.id}</span>
        <p className="rounded-lg bg-gray-200 shadow-lg cursor-default p-1 px-2 text-sm text-black">
          {DateHelper.format(props.createdAt)}
        </p>
      </div>

      <div className="flex flex-1 justify-between">
        <div className="flex flex-1 flex-col items-center border-r-2 border-dashed border-gray-300 pt-1">
          <p className="text-lg text-black">Name</p>
          <p className="text-xl font-bold text-black">{props.name}</p>
        </div>
        <div className="flex flex-1 flex-col items-center border-gray-300 pt-1">
          <p className="text-lg text-black">Quantity</p>
          <p className="text-xl font-bold text-black">{props.quantity}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="flex justify-end">
          <Button
            icon={<EditOutlined />}
            onClick={props.onUpdate}
            className="flex space-x-1 items-center hover:font-bold hover:text-dark-blue focus:text-dark-blue text-dark-blue"
            type="link"
            size="small"
          >
            Update
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={props.onRemove}
            className="flex space-x-1 items-center hover:font-bold hover:text-dark-red focus:text-dark-red text-dark-red"
            type="link"
            size="small"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackSizeCard;
