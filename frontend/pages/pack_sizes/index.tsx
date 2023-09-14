import { ReactElement, useState } from "react";
import Authentication from "@/components/Layout/Authentication";
import MainLayout from "@/components/Layout/MainLayout";
import Application from "@/components/Layout/Application";
import { NextPageWithLayout } from "../_app";
import { Button } from "antd";
import PackSizeModal from "@/components/PackSize/PackSizeModal";
import { PackSizeFormValues } from "@/components/PackSize/PackSizeModal/PackSizeForm";
import PackSizeCard from "@/components/PackSize/PackSizeCard";
import { IPackSize } from "@/interfaces/IPackSize";
import useUser from "@/hooks/useUser";
import usePackSize from "@/hooks/usePackSize";
import ErrorHelper from "@/helpers/ErrorHelper";
import toast from "react-hot-toast";
import SvgIcon from "@/components/Shared/SvgIcons";

const INITIAL_VALUES: PackSizeFormValues = {
  quantity: 1,
  name: "",
};

const Page: NextPageWithLayout = () => {
  const { isAdmin } = useUser();
  const [formValues, setFormValues] =
    useState<PackSizeFormValues>(INITIAL_VALUES);
  const [showPackSizeModal, setShowPackSizeModal] = useState(false);
  const onShowPackSizeModal = () => setShowPackSizeModal(true);
  const onClosePackSizeModal = () => setShowPackSizeModal(false);

  const {
    packSizes,
    packSizesQuery,
    createPackSizeMutation,
    updatePackSizeMutation,
    deletePackSizeMutation,
  } = usePackSize({
    page_size: 5,
  });

  const onShowCreatePackSizeModal = () => {
    setFormValues(INITIAL_VALUES);
    onShowPackSizeModal();
  };

  const onShowUpdatePackSizeModal = (packSize: IPackSize) => {
    setFormValues({
      id: packSize.id,
      name: packSize.name,
      quantity: packSize.quantity,
    });
    onShowPackSizeModal();
  };

  const onSubmitPackSize = async (values: PackSizeFormValues) => {
    if (values.id) {
      await toast.promise(
        updatePackSizeMutation.mutateAsync({
          id: values.id,
          name: values.name,
          quantity: values.quantity,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Updating Pack Size...",
          success: "Pack Size Updated!",
        }
      );
    } else {
      await toast.promise(
        createPackSizeMutation.mutateAsync({
          name: values.name,
          quantity: values.quantity,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Creating Pack Size...",
          success: "Pack Size Created!",
        }
      );
    }
    onClosePackSizeModal();
  };

  const onRemovePackSize = async (packSize: IPackSize) => {
    if (confirm("Are you sure to delete this pack size?")) {
      await toast.promise(
        deletePackSizeMutation.mutateAsync({
          id: packSize.id,
        }),
        {
          error: ErrorHelper.parseApiError,
          loading: "Removing Pack Size...",
          success: "Pack Size Removed!",
        }
      );
    }
  };

  return (
    <div className="my-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl select-none font-bold text-dark-accent">
          Pack Sizes
        </h1>
        {isAdmin && (
          <Button
            onClick={onShowCreatePackSizeModal}
            className="bg-blue-400 focus:bg-blue-400 focus:text-white text-white shadow-lg border border-blue-400 rounded-md"
          >
            Create Pack Size
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {packSizes &&
          packSizes.pack_sizes.map((packSize) => {
            return (
              <div key={packSize.id} className="my-3">
                <PackSizeCard
                  id={packSize.id}
                  name={packSize.name}
                  quantity={packSize.quantity}
                  createdAt={packSize.created_at}
                  onUpdate={() => onShowUpdatePackSizeModal(packSize)}
                  onRemove={() => onRemovePackSize(packSize)}
                />
              </div>
            );
          })}
      </div>

      {packSizesQuery.hasNextPage && (
        <div className="mt-4 flex w-full justify-center py-2">
          <button
            className="flex items-center rounded-3xl bg-onyx px-5 py-1 font-bold "
            onClick={() => packSizesQuery.fetchNextPage()}
          >
            {packSizesQuery.isFetchingNextPage ? (
              <SvgIcon.Spinner className="mr-3 inline h-4 w-4 align-text-top" />
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      <PackSizeModal
        open={showPackSizeModal}
        onCancel={onClosePackSizeModal}
        onFinish={onSubmitPackSize}
        initialValues={formValues}
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
