import confirm from "@api/confirm";
import { Link, ThankYouBg } from "@components";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const Page = () => {
  const router = useRouter();
  const { hash } = router.query;

  if (!hash) {
    return null;
  }
  const { status } = useQuery(`/public/confirm/${hash}`, () => confirm(hash));

  return (
    <ThankYouBg>
      <div className="bg-white p-8 rounded-lg shadow-xl mx-auto">
        <h2 className="font-bold text-2xl mb-4 text-center">Account status</h2>
        {status === "loading" && (
          <p className="flex flex-col gap-1 text-center">
            Your account is being verified.
            <span>
              Please wait.
              <i className="fa-solid fa-spinner fa-spin ml-2"></i>
            </span>
          </p>
        )}
        {status === "error" && (
          <p className="animated fadeIn text-red-600">
            Error! Your account could not be confirmed.
          </p>
        )}
        {status === "success" && (
          <div className="flex w-full flex-col gap-2 items-center">
            <p className="animated fadeIn text-green-700">
              Your email address has been successfully confirmed.
            </p>
            <Link href="/login" className="button primary full animated fadeIn mt-4">
              Go to login
            </Link>
          </div>
        )}
      </div>
    </ThankYouBg>
  );
};

export default Page;
