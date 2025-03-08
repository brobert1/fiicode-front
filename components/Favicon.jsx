import React from 'react';

const Favicon = () => {
  // Favicon must be in the root of the public folder, subfolders are not supported
  // https://github.com/vercel/next.js/discussions/50704

  return (
    <>
      {/* Standard favicon */}
      <link rel="shortcut icon" href="/favicon.ico" type="image/png" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="icon" href="/favicon.png" type="image/png" />

      {/* PWA specific tags */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#4f46e5" />
      <meta name="application-name" content="Pathly" />

      {/* Apple specific tags */}
      <link rel="apple-touch-icon" href="/favicon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Pathly" />

      {/* Microsoft specific tags */}
      <meta name="msapplication-TileColor" content="#4f46e5" />
      <meta name="msapplication-tap-highlight" content="no" />
    </>
  );
};

export default Favicon;
