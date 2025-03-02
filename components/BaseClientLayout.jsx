import React from "react";

const BaseClientLayout = ({ children, floatingMenu = null }) => {
  return (
    <div className="flex min-h-screen font-body text-sm">
      <main className="min-h-screen w-full relative">
        <div className="h-screen w-full">{children}</div>
        {floatingMenu}
      </main>
    </div>
  );
};

export default BaseClientLayout;
