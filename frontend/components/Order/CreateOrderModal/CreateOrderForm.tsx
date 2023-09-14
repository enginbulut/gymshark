import { Button, Form, InputNumber } from "antd";
import { FC } from "react";

export interface CreateOrderFormValues {
  quantity: number;
}

interface CreateOrderFormProps {
  onFinish: (values: CreateOrderFormValues) => void;
  initialValues?: Partial<CreateOrderFormValues>;
}

const CreateOrderForm: FC<CreateOrderFormProps> = (props) => {
  return (
    <Form initialValues={props.initialValues} onFinish={props.onFinish}>
      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          { required: true, message: "Please enter a quantity!" },
          {
            type: "number",
            min: 1,
            message: "Please enter a quantity higher than 0!",
          },
        ]}
      >
        <InputNumber min="1" className="w-full" />
      </Form.Item>

      <Form.Item className="flex justify-end">
        <Button type="default" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOrderForm;
