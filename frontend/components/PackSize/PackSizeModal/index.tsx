import { FC } from "react";
import { Modal } from "antd";
import PackSizeForm, { PackSizeFormValues } from "./PackSizeForm";

interface PackSizeModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: PackSizeFormValues) => void;
  initialValues: Partial<PackSizeFormValues>;
}

const PackSizeModal: FC<PackSizeModalProps> = (props) => {
  return (
    <Modal
      title={props.initialValues.id ? "Modify Pack Size" : "Create Pack Size"}
      closable
      open={props.open}
      footer={null}
      destroyOnClose
      onCancel={props.onCancel}
    >
      <PackSizeForm
        initialValues={props.initialValues}
        onFinish={props.onFinish}
      />
    </Modal>
  );
};

export default PackSizeModal;
