import { useInfiniteQuery, useDisclosure } from "@hooks";
import { Button } from "@components";
import { AddPartnerModal } from "@components/Modals";
import PartnersLoading from "./PartnersLoading";
import PartnersError from "./PartnersError";
import PartnersSuccess from "./PartnersSuccess";
import { isEmpty } from "lodash";

const Partners = ({ options }) => {
  const { data, status } = useInfiniteQuery("/admin/partners", options);
  const partners = data?.pages.flat() || [];

  const addPartnerModal = useDisclosure();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <p className="text-xl font-medium">Partners Available: {partners.length}</p>
        <Button
          onClick={addPartnerModal.show}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center"
        >
          <i className="fas fa-plus mr-2" /> Add Partner
        </Button>
      </div>
      {status === "error" && <PartnersError />}
      {status === "loading" && <PartnersLoading />}
      {status === "success" && (
        <>
          {isEmpty(partners) ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600 mb-4">There are no partners yet.</p>
            </div>
          ) : (
            <PartnersSuccess data={data} />
          )}
        </>
      )}
      <AddPartnerModal isOpen={addPartnerModal.isOpen} hide={addPartnerModal.hide} />
    </div>
  );
};

export default Partners;
