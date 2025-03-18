import React from "react";

const Features = () => {
  return (
    <main className="w-full bg-white text-gray-800 px-4 md:px-8 py-12">
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Simplify Your Journey with
          <span className="text-secondary"> Personalized Options</span>
        </h1>
        <p className="text-white mt-2 text-sm font-semibold text-secondary bg-primary inline-block px-4 py-1 rounded-full">
          All-in-One Mobility App
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Access public transit, rideshare, and eco-friendly routes all in one place.
          Customize your profile, receive real-time alerts, and earn rewards for smart travel choices.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {data.map((feature, index) => (
          <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md text-center flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full text-xl">
              {feature.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
};

const data = [
  {
    icon: "🚀",
    title: "Real-Time Updates",
    description: "Stay informed with live traffic, transit, and rideshare alerts."
  },
  {
    icon: "💰",
    title: "Earn Rewards",
    description: "Get incentives for choosing sustainable and efficient travel options."
  },
  {
    icon: "📍",
    title: "Personalized Routes",
    description: "Customize your journey with preferences for transit, time, and cost."
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your data is encrypted and never shared without permission."
  },
  {
    icon: "⚡",
    title: "One-Click Booking",
    description: "Seamlessly book rideshares and transit passes within the app."
  },
  {
    icon: "🌍",
    title: "Eco-Friendly Options",
    description: "Reduce your carbon footprint with green travel suggestions."
  }
];

export default Features;
