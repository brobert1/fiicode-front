import React from "react";

const About = () => {
  return (
    <section className="w-full bg-gray-50 text-gray-800 px-6 md:px-12 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-600">"The best way to predict the future is to create it."</h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Every great innovation starts with a problem. Our journey began with a simple yet frustrating realization—
          managing daily commutes, rideshares, and sustainable travel options was complicated. Too many apps, too many 
          decisions, and not enough real-time information.
        </p>
      </div>

      <div className="mt-12 max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-600">The Birth of an Idea</h3>
        <p className="mt-3 text-gray-600">
          It all started when our team members, frequent travelers and commuters, noticed a recurring issue—planning 
          a journey was inefficient. Whether it was switching between rideshare apps, checking public transport schedules, 
          or finding eco-friendly routes, everything felt disconnected.
        </p>
        <p className="mt-3 text-gray-600">
          We asked ourselves: <span className="font-semibold text-gray-800">Why isn't there one platform that brings it all together?</span>  
          A system that offers real-time updates, smart route suggestions, and rewards for making greener choices.
        </p>
      </div>

      
      <div className="mt-8 max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-600">Solving a Real-World Problem</h3>
        <p className="mt-3 text-gray-600">
          We realized that modern travel isn’t just about getting from point A to point B—it’s about efficiency, convenience, 
          and sustainability. Our app was built to simplify mobility, integrate various transport options, and provide a seamless 
          travel experience, whether you're commuting to work, exploring a new city, or just running errands.
        </p>
      </div>
      <div className="mt-8 max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-blue-600">Our Vision</h3>
        <p className="mt-3 text-gray-600">
          We believe that smart technology can enhance mobility while reducing environmental impact. Our vision is to create 
          a world where travel is **smarter, greener, and more accessible to everyone**. We’re committed to improving urban 
          mobility by offering a one-stop solution that adapts to your needs and rewards you for making eco-friendly choices.
        </p>
      </div>
    </section>
  );
};

export default About;
