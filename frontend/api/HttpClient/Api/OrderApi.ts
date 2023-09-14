import {
  CreateOrderInputParams,
  IOrderCreateResponse,
  IOrderItem,
  IOrderListResponse,
} from "@/interfaces/IOrder";
import { IPageParams } from "@/interfaces/IPageParam";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Axios } from "axios";

const IndexOrdersKey = (
  filters: IPageParams | undefined
): [string, IPageParams | undefined] => ["Orders", filters];

const ShowOrderKey = (id: number | undefined): [string, number | undefined] => [
  "Order",
  id,
];

const OrderApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof IndexOrdersKey>>
    ) => {
      const [, filters] = context.queryKey;
      const pageParams: IPageParams = context.pageParam || {
        page_id: 1,
        page_size: filters?.page_size,
      };

      const response = await request.get<IOrderListResponse>("/orders", {
        params: pageParams,
      });
      return response.data;
    },
    key: IndexOrdersKey,
  },
  show: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof ShowOrderKey>>
    ) => {
      const [, id] = context.queryKey;
      const response = await request.get<IOrderItem[]>(`/orders/${id}`);
      return response.data;
    },
    key: ShowOrderKey,
  },
  create: async (params: CreateOrderInputParams) =>
    await request.post<IOrderCreateResponse>("/orders", params),
});
export default OrderApi;
