import { checkAuth, withAuth } from "@auth";
import ClientPreferencesForm from "@components/Forms/Client/ClientPreferencesForm";

const Page = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8 my-10 md:my-0">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-black flex items-center justify-center gap-2">
          <i className="fa-solid fa-route"></i>
          Transport Preferences
        </h1>
        <p className="text-gray-400">
          Help us understand your travel habits to provide better recommendations for your trips.
        </p>
      </div>
      <div className="my-8 flex w-full max-w-5xl flex-col rounded-lg bg-white px-4 py-8 lg:px-12 shadow-xl border-2 ">
        <ClientPreferencesForm />
      </div>
    </main>
  );
};

export async function getServerSideProps(context) {
  return await checkAuth(context);
}

export default withAuth(Page);
