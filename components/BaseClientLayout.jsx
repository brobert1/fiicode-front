import React from "react";

const BaseClientLayout = ({ children, floatingMenu = null }) => {
  return (
    <div className="flex min-h-screen font-body text-sm overflow-hidden">
      <main className="min-h-screen w-full relative overflow-hidden">
        <div className="h-screen w-full overflow-hidden">{children}</div>
        {floatingMenu}
      </main>
    </div>
  );
};

export default BaseClientLayout;
