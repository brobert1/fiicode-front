require("dotenv").config();
const headers = require("./headers");

module.exports = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    APP_BASE_URL: process.env.APP_BASE_URL,
    FONT_AWESOME_KEY: process.env.FONT_AWESOME_KEY,
    JWT_TOKEN_NAME: process.env.JWT_TOKEN_NAME,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    SHOW_FORM_DEBUG: process.env.SHOW_FORM_DEBUG,
    SHOW_LOGS_EVERYWHERE: process.env.SHOW_LOGS_EVERYWHERE,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_MAPS_ID: process.env.GOOGLE_MAPS_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
  generateEtags: false,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },
};
