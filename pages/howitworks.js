import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Download the App",
      description: "Get started by downloading the app from the App Store or Google Play. The installation is quick and easy."
    },
    {
      step: "2",
      title: "Create Your Profile",
      description: "Sign up with your email or phone number. Set your travel preferences for a personalized experience."
    },
    {
      step: "3",
      title: "Plan & Customize",
      description: "Enter your destination and choose from public transport, rideshare, or eco-friendly routes."
    },
    {
      step: "4",
      title: "Book & Pay",
      description: "Seamlessly book your ride within the app and pay securely using multiple payment options."
    },
    {
      step: "5",
      title: "Enjoy & Earn Rewards",
      description: "Travel hassle-free and earn rewards for choosing sustainable transport options."
    }
  ];

  return (
    <section className="w-full bg-white text-gray-800 px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Follow these simple steps to start your seamless journey.
        </p>
      </div>

      <div className="mt-12 max-w-4xl mx-auto space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-6 p-6 bg-gray-100 rounded-lg shadow-md">
           
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-blue-600 font-bold text-xl rounded-full">
              {step.step}
            </div>
        
            <div>
              <h3 className="text-xl font-semibold text-blue-600">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
