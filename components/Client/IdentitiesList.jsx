import { Error, Loading } from "@components";
import { useQuery } from "@hooks";
import IdentityCard from "./IdentityCard";

const IdentitiesList = ({ options }) => {
  const { data: identities, refetch, status } = useQuery("/client/identities", options);

  return (
    <div className="space-y-3 mt-4 overflow-y-auto no-scrollbar">
      {status === "loading" && <Loading />}
      {status === "error" && <Error message="Error loading identities" />}
      {status === "success" && identities.length === 0 && (
        <div className="text-center py-4 text-gray-500">No users found</div>
      )}
      {status === "success" &&
        identities.length > 0 &&
        identities.map((identity) => (
          <IdentityCard key={identity.id} identity={identity} refetch={refetch} />
        ))}
    </div>
  );
};

export default IdentitiesList;
