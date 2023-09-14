import { HttpClient } from "@/api/HttpClient";
import { IOrderListResponse } from "@/interfaces/IOrder";
import { IPageParams } from "@/interfaces/IPageParam";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import _ from "lodash";

export default function useOrder(filters?: IPageParams, orderId?: number) {
  const queryClient = useQueryClient();

  const { data: orders, ...ordersQuery } = useInfiniteQuery(
    HttpClient.BrowserSide.OrderApi.index.key(filters),
    HttpClient.BrowserSide.OrderApi.index.fetcher,
    {
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allpages): IPageParams | undefined =>
        lastPage.orders.length === filters?.page_size &&
        lastPage.total !== _.sum(allpages.map((page) => page.orders.length))
          ? {
              page_id: allpages.length + 1,
              page_size: filters.page_size,
            }
          : undefined,
    }
  );

  const { data: orderItems, ...orderItemsQuery } = useQuery(
    HttpClient.BrowserSide.OrderApi.show.key(orderId),
    HttpClient.BrowserSide.OrderApi.show.fetcher,
    {
      staleTime: 0,
      retry: false,
    }
  );

  const createOrderMutation = useMutation(
    HttpClient.BrowserSide.OrderApi.create,
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries(["Orders"]);
      },
    }
  );

  return {
    orders: orders?.pages?.reduce(
      (acc, currPage) => ({
        orders: [...acc.orders, ...currPage.orders],
        total: currPage?.total,
      }),
      {
        orders: [],
        total: 0,
      } as IOrderListResponse
    ),
    ordersQuery,
    orderItems,
    orderItemsQuery,
    createOrderMutation,
  };
}
