export interface IPackSize {
  id: number;
  quantity: number;
  name: string;
  created_at: string;
}

export interface IPackSizeList {
  pack_sizes: Array<IPackSize>;
  total: number;
}

export interface CreatePackSizeInputParams {
  name: string;
  quantity: number;
}

export interface UpdatePackSizeInputParams extends CreatePackSizeInputParams {
  id: number;
}
