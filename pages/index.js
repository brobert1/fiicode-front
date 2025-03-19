import { Link } from "@components";
import React from "react";

const Page = () => {
  return (
    <main>
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col-reverse md:flex-row items-center">
          <div className="mt-8 md:mt-0 md:w-1/2 md:pr-8">
            <p className="text-sm font-semibold text-secondary bg-primary inline-block px-2 py-1 rounded-full">
              All-in-One Mobility App
            </p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Simplify Your Journey with
              <span className="text-secondary"> Personalized Options</span>
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Access public transit, rideshare, and eco-friendly routes all in one place. Customize
              your profile, receive real-time alerts, and earn rewards for smart travel choices.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary transition text-center"
              >
                Get Pathly Free
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 bg-white border border-primary text-secondary font-semibold rounded-full hover:bg-primary transition text-center"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="relative md:w-1/2 w-full flex justify-center">
            <img
              src="/images/phone.png"
              alt="Phone Illustration"
              className="w-full md:w-4/5 h-90 object-cover rounded-xl"
            />
            <div className="hidden sm:block absolute top-1/4 right-0 transform -translate-x-1/4 bg-white shadow-md rounded-md p-2 text-xs text-gray-700">
              Real-Time Updates
            </div>
            <div className="hidden sm:block absolute bottom-1/4 left-0 transform translate-x-1/4 bg-white shadow-md rounded-md p-2 text-xs text-gray-700">
              Earn Rewards
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-800">
              All the Features You Need
            </h2>
            <p className="mt-3 text-gray-600">
              Pathly offers a secure, smart, and sustainable travel experience. Explore multiple
              route options, customize your preferences, and get rewarded for eco-friendly choices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-user-check"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">
                  Easy Sign In &amp; Profile Setup
                </h3>
              </div>
              <p className="text-gray-600">
                Register securely and personalize your transport preferences and notification
                settings.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-route"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">
                  Explore Routes &amp; Options
                </h3>
              </div>
              <p className="text-gray-600">
                Discover alternative routes with public transit, ridesharing, and eco-friendly
                solutions. Filter by time, cost, or ecological impact.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">Earn Rewards</h3>
              </div>
              <p className="text-gray-600">
                Collect points, badges, and achievements for choosing eco-friendly travel options.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">Real-Time Alerts</h3>
              </div>
              <p className="text-gray-600">
                Stay informed with live notifications on traffic, delays, and incidents.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-comment-dots"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">
                  Feedback &amp; Reporting
                </h3>
              </div>
              <p className="text-gray-600">
                Report mobility issues or suggest improvements to enhance your travel experience.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-primary text-secondary rounded-full">
                  <i className="fa-solid fa-sliders"></i>
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800">
                  Customizable Experience
                </h3>
              </div>
              <p className="text-gray-600">
                Save your favorite routes and adjust your transport preferences for a tailored
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-800">How It Works</h2>
            <p className="mt-3 text-gray-600">
              Get started in four simple steps for a personalized, efficient, and rewarding travel
              experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-secondary font-bold mb-3">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Sign Up &amp; Customize</h3>
              <p className="text-gray-600">
                Create your account and set up your profile preferences.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-secondary font-bold mb-3">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Enter Destination</h3>
              <p className="text-gray-600">
                Input your destination to receive multiple transportation options.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-secondary font-bold mb-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Compare &amp; Choose</h3>
              <p className="text-gray-600">
                Filter and compare routes by travel time, cost, and eco-impact.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-secondary font-bold mb-3">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Stay Informed &amp; Earn Rewards
              </h3>
              <p className="text-gray-600">
                Get real-time alerts and earn rewards for making smart, eco-friendly choices.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-50 pt-10 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div className="md:w-1/3">
              <div className="flex items-center space-x-2">
                  <img
                    src="/favicon.png"
                    alt="Pathly Logo"
                    className="w-10 h-10"
                  />
                <span className="font-bold text-lg text-gray-800">Pathly</span>
              </div>
              <p className="mt-4 text-gray-600">
                Pathly is your all-in-one mobility app. Enjoy secure access, personalized route
                planning, real-time alerts, and rewards for sustainable travel.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                  <Link href="/features">Features</Link>

                  </li>
                  <li>
                  <Link href="/howitworks">How it works</Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Pricing
                    </a>
                  </li>
                  <li>
                  <Link href="/faq">FAQ</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                  <Link href="/about">About </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Press
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                  <Link href="/policy">Privacy Policy</Link>
                  </li>
                  <li>
                  <Link href="/#">Cookies Policy</Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-900 transition">
                      Data Processing
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center text-gray-400 text-sm">
            <p>© 2025 Pathly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Page;
