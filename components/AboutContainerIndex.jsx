import { motion } from "framer-motion";

const AboutContainerIndex = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-2">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-green-600 mb-4 text-center"
        >
          🌍 Trusted By Thousands
        </motion.h2>

        <p className="text-lg text-gray-700 max-w-2xl text-center">
          Pathly is a growing community of eco-conscious riders and drivers, working together 
          to make transportation greener and more affordable.
        </p>

        <motion.div 
          className="flex gap-6 mt-6 items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { src: "/images/Hertz_Global_Logo.png", size: "h-16 w-16" },
            { src: "/images/Waze_logo.png", size: "h-12 w-12" },
            { src: "/images/Tesla_logo.png", size: "h-12 w-12 grayscale" },
            { src: "/images/BYD_logo.png", size: "h-12 w-12 grayscale" },
            { src: "/images/Polestar_logo.png", size: "h-16 w-16 grayscale" }
          ].map((logo, index) => (
            <motion.img
              key={index}
              src={logo.src}
              className={`${logo.size} object-contain opacity-75 hover:opacity-100`}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            />
          ))}
        </motion.div>

        <h3 className="text-2xl font-semibold text-gray-800 mt-10">
          What Our Customers Say 💬
        </h3>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } }
          }}
        >
          {[
            { text: `"Pathly has completely changed my daily commute. I save money and reduce emissions!"`, rating: "⭐⭐⭐⭐⭐", name: "Jimmy" },
            { text: `"I love using Pathly! It's reliable, safe, and helps the environment."`, rating: "⭐⭐⭐⭐", name: "Michael" }
          ].map((review, index) => (
            <motion.div 
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <p className="text-gray-700">{review.text}</p>
              <div className="flex items-center justify-center mt-2 text-xl">
                {review.rating}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                - {review.name} -
              </p>
            </motion.div>
          ))}
        </motion.div>

        <a
          href="/signup"
          className="mt-8 bg-green-400 px-6 py-2 border-1 shadow-xl transition-all duration-150 rounded-lg text-black hover:border-transparent hover:scale-110 mb-8"
        >
          Join Now
        </a>
      </div>
  );
};

export default AboutContainerIndex;
