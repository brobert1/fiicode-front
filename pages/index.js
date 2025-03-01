import { Link } from '@components';
import SlideContainer_Slide from '@components/SlideContainer_Slide';

const Page = () => {
  return (
<SlideContainer_Slide>
        <div className="flex flex-col text-white items-center">
          <h2 className="text-2xl font-bold">Prima parte</h2>
  <p>Welcome to the first slide!</p>
        </div>

     
    <div className="flex flex-col text-white items-center">
          <h2 className="text-2xl font-bold">A doua parte</h2>
         <p>Kurwa Bober</p>
        </div>

        <div className="flex flex-col text-white items-center">
          <h2 className="text-2xl font-bold">A treia parte</h2>
          <Link href="/signup" className="font-bold text-purple-800">
            Signup now
          </Link>
        </div>
      </SlideContainer_Slide>
   
  );
};

export default Page;
