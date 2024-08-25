const http = require("http");
const https = require("https");
const sharp = require("sharp");

const saveCropImage = (url, outputPath, width, height) => {
  const protocol = url.startsWith("https") ? https : http;

  protocol
    .get(url, (response) => {
      let data = Buffer.from([]);

      response.on("data", (chunk) => {
        data = Buffer.concat([data, chunk]);
      });

      response.on("end", () => {
        sharp(data)
          .resize(width, height, { fit: "inside" })
          .webp({ quality: 70 })
          .toFile(outputPath, (err, info) => {
            if (err) {
              console.error("Error resizing image:", err);
            } else {
              console.log("Image resized and saved:", info);
            }
          });
      });
    })
    .on("error", (err) => {
      console.error("Error downloading image:", err);
    });
};

module.exports = saveCropImage;
