import confirm from "@api/confirm";
import { Link } from "@components";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ThankYouBg from "@components/ThankYouBg";
const Page = () => {
  const router = useRouter();
  const { hash } = router.query;

  if (!hash) {
    return null;
  }
  const { status } = useQuery(`/public/confir/${hash}`, () => confirm(hash));

  return (
    <ThankYouBg
      content={
        <div className="bg-white p-8 rounded-lg shadow-xl mx-auto">
          <h2 className="font-bold text-2xl mb-6 text-center">Status Cont</h2>
                  {status === "loading" && (
          <p>
            Contul tău este în curs de verificare. Te rugăm sa aștepți.{" "}
            <i className="fa-solid fa-spinner fa-spin ml-2"></i>
          </p>
        )}
        {status === "error" && (
          <p className="animated fadeIn text-red-600">Eroare! Contul tău nu a fost confirmat.</p>
        )}
        {status === "success" && (
          <>
            <p className="animated fadeIn text-green-700">
              Succes! Adresa ta de e-mail a fost confirmată.
            </p>
            <Link href="/login" className="animated fadeIn mt-4">
              Go to login
            </Link>
            </>
          )}
        </div>
      }
    />
  );
};

export default Page;
