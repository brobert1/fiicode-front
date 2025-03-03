import { motion } from "framer-motion";
import Image from "next/image";
const IntroSectionIndex = () => {
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      >
        <Image src="/images/logo.png" alt="App Logo" width={600} height={550} />
      </motion.div>


      <motion.div
        className="text-3xl text-black font-bold mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
      >
        Ridesharing, Simplified.
      </motion.div>

      <motion.div
        className="mt-6 flex space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.6, ease: "easeOut" }}
      >
        <a
        href="/login"
        className="mt-8 bg-green-400 px-6 py-2 border-1 shadow-xl transition-all duration-150 rounded-lg text-black hover:border-transparent hover:scale-110">
        Login
        </a>
        <a
        href="/signup"
        className="mt-8 bg-green-400 px-6 py-2 border-1 shadow-xl transition-all duration-150 rounded-lg text-black hover:border-transparent hover:scale-110">
        SignUp
        </a>
      </motion.div>
  </div>
  );
};

export default IntroSectionIndex;
