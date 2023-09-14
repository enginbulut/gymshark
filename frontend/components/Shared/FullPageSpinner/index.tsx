import { Spin } from "antd";
import { FC } from "react";

interface FullPageSpinnerProps {}

const FullPageSpinner: FC<FullPageSpinnerProps> = (props) => {
  return (
    <div className="w-screen h-screen absolute z-50 inset-0 flex items-center justify-center bg-white bg-opacity-30 animate-pulse">
      <Spin size="large" />
    </div>
  );
};

export default FullPageSpinner;
