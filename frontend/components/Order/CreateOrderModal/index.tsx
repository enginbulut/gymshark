import { Modal } from "antd";
import { FC } from "react";
import CreateOrderForm, { CreateOrderFormValues } from "./CreateOrderForm";

interface CreateOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: CreateOrderFormValues) => void;
  initialValues: Partial<CreateOrderFormValues>;
}

const CreateOrderModal: FC<CreateOrderModalProps> = (props) => {
  return (
    <Modal
      title="Create Order"
      closable
      open={props.open}
      footer={null}
      destroyOnClose
      onCancel={props.onCancel}
    >
      <CreateOrderForm
        initialValues={props.initialValues}
        onFinish={props.onFinish}
      />
    </Modal>
  );
};

export default CreateOrderModal;
