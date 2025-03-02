import { FloatingMenu } from "@components";
import BaseClientLayout from "./BaseClientLayout";

const MapClientLayout = ({ children }) => {
  return (
    <BaseClientLayout floatingMenu={<FloatingMenu />}>
      {children}
    </BaseClientLayout>
  );
};

export default MapClientLayout;
