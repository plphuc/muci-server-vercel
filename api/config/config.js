import 'dotenv/config';

const config = {
  port: process.env.PORT,
  uriMongoDB: process.env.URIMONGODB,
  accessTime: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshTime: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  secret: process.env.JWT_SECRET,
};

export default config;