import {
  IPackSize,
  CreatePackSizeInputParams,
  UpdatePackSizeInputParams,
  IPackSizeList,
} from "@/interfaces/IPackSize";
import { IPageParams } from "@/interfaces/IPageParam";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Axios } from "axios";

const IndexPackSizesKey = (filters: IPageParams): [string, IPageParams] => [
  "PackSizes",
  filters,
];

const PackSizeApi = (request: Axios) => ({
  index: {
    fetcher: async (
      context: QueryFunctionContext<ReturnType<typeof IndexPackSizesKey>>
    ) => {
      const [, filters] = context.queryKey;
      const pageParams: IPageParams = context.pageParam || {
        page_id: 1,
        page_size: filters.page_size,
      };

      const response = await request.get<IPackSizeList>("/pack_sizes", {
        params: pageParams,
      });
      return response.data;
    },
    key: IndexPackSizesKey,
  },

  create: async (params: CreatePackSizeInputParams) =>
    await request.post<IPackSize>("/pack_sizes", params),
  update: async (params: UpdatePackSizeInputParams) =>
    await request.put<IPackSize>(`/pack_sizes/${params.id}`, params),
  delete: async (params: { id: number }) =>
    await request.delete(`/pack_sizes/${params.id}`),
});
export default PackSizeApi;
