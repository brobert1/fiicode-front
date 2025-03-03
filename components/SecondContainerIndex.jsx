import { motion } from "framer-motion";

const SecondContainerIndex = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.h2
        className="text-4xl font-bold text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Why Choose <span className="text-green-400">Pathly</span>? 🤔
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        
        <motion.div
          className="bg-gray-100 p-6 rounded-xl flex flex-col items-center text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <p className="text-3xl mb-2">⚡</p>
          <h3 className="text-2xl font-semibold">Lightning Fast</h3>
          <p className="text-gray-600 mt-2">
            Get matched with rides instantly and reach your destination without unnecessary delays.
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-100 p-6 rounded-xl flex flex-col items-center text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
        <p className="text-3xl mb-2">💰</p>
          <h3 className="text-2xl font-semibold">Affordable Rides</h3>
          <p className="text-gray-600 mt-2">
            Enjoy eco-friendly transportation at prices that won't break the bank.
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-100 p-6 rounded-xl flex flex-col items-center text-center shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
        <p className="text-3xl mb-2">🛡️</p>
          <h3 className="text-2xl font-semibold">Safety First</h3>
          <p className="text-gray-600 mt-2">
            Verified drivers, secure payments, and real-time tracking for a worry-free experience.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default SecondContainerIndex;
