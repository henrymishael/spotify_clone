import { ImSpinner8 } from 'react-icons/im';
const Loader = () => {
  return (
    <div className="h-[60vh] flex justify-center items-center w-full ">
      <ImSpinner8 className="w-6 h-6 text-[#009254] animate-spin" />
    </div>
  );
};

export default Loader;