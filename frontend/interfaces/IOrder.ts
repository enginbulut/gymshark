export interface IOrder {
  id: number;
  purchased_item_count: number;
  requested_item_count: number;
  user_id: number;
  created_at: string;
}

export interface IOrderItem {
  id: number;
  quantity: number;
  pack_size_id: number;
  pack_size_name: string;
  order_id: number;
  user_id: number;
  user_full_name: string;
  created_at: string;
}

export interface CreateOrderInputParams {
  quantity: number;
}

export interface IOrderCreateResponse {
  order: IOrder;
  items: any;
}

export interface IOrderList extends IOrder {
  user_email: string;
  user_full_name: string;
}

export interface IOrderListResponse {
  orders: IOrderList[];
  total: number;
}
