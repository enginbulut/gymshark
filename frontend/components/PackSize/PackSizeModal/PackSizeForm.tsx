import { Button, Form, Input, InputNumber } from "antd";
import { FC } from "react";

export interface PackSizeFormValues {
  id?: number;
  name: string;
  quantity: number;
}

interface PackSizeFormProps {
  onFinish: (values: PackSizeFormValues) => void;
  initialValues: Partial<PackSizeFormValues>;
}

const PackSizeForm: FC<PackSizeFormProps> = (props) => {
  return (
    <Form
      labelCol={{ span: 5 }}
      initialValues={props.initialValues}
      onFinish={props.onFinish}
    >
      {props.initialValues.id && (
        <Form.Item label="ID" name="id">
          <Input disabled className="w-full" />
        </Form.Item>
      )}

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter a name!" }]}
      >
        <Input className="w-full" />
      </Form.Item>

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
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PackSizeForm;
