import { ReactElement, useState } from "react";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import Application from "@/components/Layout/Application";
import { NextPageWithLayout } from "../_app";
import OrderCard from "@/components/Order/OrderCard";
import { Button } from "antd";
import CreateOrderModal from "@/components/Order/CreateOrderModal";
import { CreateOrderFormValues } from "@/components/Order/CreateOrderModal/CreateOrderForm";
import useOrder from "@/hooks/useOrder";
import toast from "react-hot-toast";
import ErrorHelper from "@/helpers/ErrorHelper";
import SvgIcon from "@/components/Shared/SvgIcons";

const Page: NextPageWithLayout = () => {
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const onShowCreateOrderModal = () => setShowCreateOrderModal(true);
  const onCloseCreateOrderModal = () => setShowCreateOrderModal(false);

  const { orders, ordersQuery, createOrderMutation } = useOrder({
    page_id: 1,
    page_size: 5,
  });

  const onCreateOrder = async (values: CreateOrderFormValues) => {
    await toast.promise(
      createOrderMutation.mutateAsync({
        quantity: values.quantity,
      }),
      {
        error: ErrorHelper.parseApiError,
        loading: "Creating Order...",
        success: "Order Created!",
      }
    );
    onCloseCreateOrderModal();
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl select-none font-bold text-dark-accent">
          Orders
        </h1>
        <Button
          onClick={onShowCreateOrderModal}
          className="bg-blue-400 text-white shadow-lg border border-blue-400 rounded-md"
        >
          Create Order
        </Button>
      </div>

      <div>
        {orders &&
          orders.orders.map((order) => {
            return (
              <div key={order.id} className="my-3">
                <OrderCard
                  id={order.id}
                  createdAt={order.created_at}
                  purchasedItemCount={order.purchased_item_count}
                  requestedItemCount={order.requested_item_count}
                  userId={order.user_id}
                  userFullName={order.user_full_name}
                />
              </div>
            );
          })}
      </div>

      {ordersQuery.hasNextPage && (
        <div className="mt-4 flex w-full justify-center py-2">
          <button
            className="flex items-center rounded-3xl bg-onyx px-5 py-1 font-bold "
            onClick={() => ordersQuery.fetchNextPage()}
          >
            {ordersQuery.isFetchingNextPage ? (
              <SvgIcon.Spinner className="mr-3 inline h-4 w-4 align-text-top" />
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      <CreateOrderModal
        open={showCreateOrderModal}
        onCancel={onCloseCreateOrderModal}
        initialValues={{ quantity: 1 }}
        onFinish={onCreateOrder}
      />
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Authentication>
        <Application>{page}</Application>
      </Authentication>
    </MainLayout>
  );
};

export default Page;
