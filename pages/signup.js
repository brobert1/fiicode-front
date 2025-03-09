import { GoogleLogin, Link } from "@components";
import { SignupForm } from "@components/Forms";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 bg-white px-4 py-6 lg:w-1/2 lg:justify-center">
        <div className="flex w-full max-w-lg flex-col gap-2">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="font-semibold text-5xl">Hi there</h2>
            <p className="text-lg text-gray-400">Enter your details below and start exploring</p>
          </div>
          <GoogleLogin />
          <div className="flex items-center w-full mt-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <p className="mx-4 text-gray-600">or</p>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <SignupForm />
          <div className="w-full flex justify-center">
            <span className="mr-1">Already have an account?</span>
            <Link href="/login" className="text-gray-600 hover:underline">
              <span className="font-bold text-purple-800">Log in</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden h-screen w-full md:hidden lg:flex lg:w-1/2 lg:flex-row">
        <img
          src="/images/login-bg.jpeg"
          alt="Background-Blue"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </main>
  );
};

export default Page;
