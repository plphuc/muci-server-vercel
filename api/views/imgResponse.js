// import fs from 'fs';
// import https from 'https';
// export const create = async (req, res, next) => {
//   try {
//     const image = req.file;
//     let imagePath = '';
//     if (image) {
//       imagePath = image.path;
//     }
//     console.log(imagePath);
//     res.json({
//       success: 1,
//       file: {
//         url: `http://localhost:8080/${imagePath}`,
//       },
//     });
//   } catch (error) {
//     console.log('loi roi ban oi');
//     res.status(400).json(error);
//   }
// };

// export const createUrl = async (req, res, next) => {
//   try {
//     const { url } = req.body;
//     const name = Date.now().toString();
//     const imagePath = `public\\uploadImages\\${name}.jpg`;
//     // create writable stream to get image from url
//     const file = fs.createWriteStream(`./${imagePath}`);
//     https.get(url, (response) => {
//       response.pipe(file);

//       file.on('finish', () => {
//         console.log('Download Complete');
//         file.close();
//         res.json({
//           success: 1,
//           file: {
//             url: `http://localhost:8080/${imagePath}`,
//           },
//         });
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// };