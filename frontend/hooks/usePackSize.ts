import { HttpClient } from "@/api/HttpClient";
import { IPackSizeList } from "@/interfaces/IPackSize";
import { IPageParams } from "@/interfaces/IPageParam";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import _ from "lodash";

export default function usePackSize(filters: IPageParams) {
  const queryClient = useQueryClient();

  const { data: packSizes, ...packSizesQuery } = useInfiniteQuery(
    HttpClient.BrowserSide.PackSizeApi.index.key(filters),
    HttpClient.BrowserSide.PackSizeApi.index.fetcher,
    {
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allpages): IPageParams | undefined =>
        lastPage.pack_sizes.length === filters.page_size &&
        lastPage.total !== _.sum(allpages.map((page) => page.pack_sizes.length))
          ? {
              page_id: allpages.length + 1,
              page_size: filters.page_size,
            }
          : undefined,
    }
  );

  const createPackSizeMutation = useMutation(
    HttpClient.BrowserSide.PackSizeApi.create,
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries(["PackSizes"]);
      },
    }
  );

  const updatePackSizeMutation = useMutation(
    HttpClient.BrowserSide.PackSizeApi.update,
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries(["PackSizes"]);
      },
    }
  );

  const deletePackSizeMutation = useMutation(
    HttpClient.BrowserSide.PackSizeApi.delete,
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries(["PackSizes"]);
      },
    }
  );

  return {
    packSizes: packSizes?.pages?.reduce(
      (acc, currPage) => ({
        pack_sizes: [...acc.pack_sizes, ...currPage.pack_sizes],
        total: currPage?.total,
      }),
      {
        pack_sizes: [],
        total: 0,
      } as IPackSizeList
    ),
    packSizesQuery,
    createPackSizeMutation,
    updatePackSizeMutation,
    deletePackSizeMutation,
  };
}
