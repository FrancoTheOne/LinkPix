"use strict";
const express = require("express");
const router = express.Router();
const path = require("path");
const OpenCC = require("opencc-js");
const { Album } = require("../models");
const prefixReducer = require("../utils/prefixReducer");
const saveCropImage = require("../utils/saveCropImage");
const { Op } = require("sequelize");

const zhConverter = OpenCC.Converter({ from: "cn", to: "hk" });
const thumbnailFolder = path.join(
  __dirname,
  "../../linkpix/public/image/thumbnails"
);

router.get("/list", async (req, res) => {
  const offset = parseInt(req.query?.offset) || 0;
  const limit = parseInt(req.query?.limit) || 20;
  const search = req.query.search;
  const { count, rows: data } = await Album.findAndCountAll({
    attributes: ["id", "name", "category", "author", "thumbnail", "source"],
    where: req.query.search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { author: { [Op.like]: `%${search}%` } },
          ],
        }
      : {},
    order: [["createdAt", "DESC"]],
    offset,
    limit,
  });
  res.json({ data, count, offset: Number(offset), limit: Number(limit) });
});

router.get("/:id", async (req, res) => {
  const album = await Album.findOne({
    where: { id: req.params.id },
    attributes: ["data"],
  });
  res.json(album);
});

router.post("/", async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    if (!data || !data.length) return;
    const fileName = `${new Date().getTime()}.webp`;

    saveCropImage(data[0], path.join(thumbnailFolder, fileName), 256, 256);
    const title = zhConverter(req.body.title);
    const payload = {
      name: title,
      category: req.body.category,
      author: title,
      source: req.body.source,
      thumbnail: fileName,
      data: JSON.stringify(prefixReducer(JSON.parse(req.body.data))),
    };
    await Album.create(payload);
    res.json(payload);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
