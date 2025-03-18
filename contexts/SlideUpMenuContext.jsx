import { createContext, useContext } from "react";

const SlideUpMenuContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
  closeMenu: () => {},
});

export const useSlideUpMenu = () => useContext(SlideUpMenuContext);

export default SlideUpMenuContext;
