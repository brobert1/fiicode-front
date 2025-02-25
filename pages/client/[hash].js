import confirm from "@api/confirm";
import { Link } from "@components";
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
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <>
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
      </>
    </main>
  );
};

export default Page;
