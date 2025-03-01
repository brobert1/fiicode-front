import { Button } from "@components";
import { useDisclosure } from "@hooks";
import ImageCombo from "./Image/ImageCombo";

const Account = ({ me }) => {
  const editInfoDisclosure = useDisclosure();
  const changePasswordDisclosure = useDisclosure();

  return (
    <div className="flex flex-col p-10 gap-10 w-full max-w-2xl">
      <ImageCombo src={me?.image?.path} uuid={me?._id} />
      <div className="flex flex-col gap-6">
        <h3 className="text-black text-2xl font-bold">Personal details</h3>
        <div className="flex flex-col divide-y divide-tertiary">
          <div className="flex justify-between pb-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-green-500">Name</p>
              <p className="text-sm text-grey font-medium">{me?.name}</p>
            </div>
            <Button
              onClick={editInfoDisclosure.show}
              className="text-black hover:underline font-semibold"
            >
              Edit
            </Button>
          </div>
          <div className="flex justify-between py-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-green-500">Email address</p>
              <p className="text-sm text-grey font-medium">{me?.email}</p>
            </div>
            <Button
              onClick={editInfoDisclosure.show}
              className="text-black hover:underline font-semibold"
            >
              Edit
            </Button>
          </div>
          {/* <EditClientInfoModal
            hide={editInfoDisclosure.hide}
            isOpen={editInfoDisclosure.isOpen}
            client={me}
          /> */}
          <div className="flex justify-between py-4">
            <div className="flex flex-col gap-1">
              <p className="font-bold text-green-500">Password</p>
              <p className="text-sm text-grey font-medium">••••••••••••</p>
            </div>
            <Button
              onClick={changePasswordDisclosure.show}
              className="text-black hover:underline font-semibold"
            >
              Edit
            </Button>
          </div>
          {/* <ChangePasswordModal
            hide={changePasswordDisclosure.hide}
            isOpen={changePasswordDisclosure.isOpen}
          /> */}
        </div>
      </div>
      {/* <div className="flex flex-col gap-6">
        <h3 className="text-white text-2xl font-bold">Manage account</h3>
        <div className="flex flex-col divide-y divide-tertiary">
          <div className="flex justify-between pb-4">
            <div className="flex flex-col">
              <p className="font-bold text-white">Delete account</p>
              <p className="text-sm text-grey font-medium">Permanently delete your account.</p>
            </div>
            <DeleteAccountModal client={me} />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Account;
