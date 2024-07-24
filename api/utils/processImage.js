import fs from 'fs';

/**
 * Convert base63 string to Image
 * @param filePath {String} defines path to save image
 * @returns nothing
 */
export function base64DecodeToImage(base64String, filePath) {
  fs.writeFileSync(filePath, base64String, { encoding: 'base64' });
}

/**
 * Convert base63 string to Image
 * @param filePath defines path of image
 * @returns base64 string of this image
 */
export function imageEncodeToBase64(filePath) {
  const image = fs.readFileSync(filePath);
  const blob = Buffer.from(image).toString('base64');
  return blob;
}
