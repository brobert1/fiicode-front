import { ThankYouBg } from "@components";

const Page = () => {
  return (
    <ThankYouBg>
      <div className="my-8 flex w-full max-w-xl flex-col rounded-lg px-4 py-8 lg:px-12 text-white bg-white shadow-xl">
        <img
          className="mb-4 w-80 h-50 rounded-full mx-auto"
          src="/images/logo.png"
          alt="FiiCodeLogo"
        />
        <h2 className="mb-8 text-2xl font-bold text-black text-center">
          Thank you for choosing Pathly!
        </h2>

        <h3 className="mb-2 text-lg font-bold text-black">Next steps:</h3>
        <ol className="list-decimal pl-6 text-black">
          <li>You will receive a confirmation email. Use it to confirm your account.</li>
          <li>After confirming your account, you will be able to access the app.</li>
        </ol>
      </div>
    </ThankYouBg>
  );
};
export default Page;
