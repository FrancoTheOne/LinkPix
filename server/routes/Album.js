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
  const order = req.query.order || "id";
  const direction = req.query.direction || "DESC";

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
    order: [
      [order, direction],
      ["id", "DESC"],
    ],
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

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findByPk(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    const result = await Album.update(req.body, { where: { id } });
    res.status(200).json({
      message: "Album updated successfully",
      data: result,
      req: req.body.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const album = await Album.findOne({
    where: { id },
    attributes: ["data"],
  });
  if (!album) {
    res.status(409).json({ message: "Album not found!" });
    return;
  }
  const result = await Album.destroy({
    where: { id },
  });
  res.json(result);
});

router.put("/", async (req, res) => {
  try {
    const album = await Album.findOne({
      where: { source: req.body.source },
    });
    const data = JSON.parse(req.body.data);
    if (!data || !data.length) return;

    const thumbnailUrl = data[req.body.currentIndex] ?? data[0];

    if (album) {
      saveCropImage(
        thumbnailUrl,
        path.join(thumbnailFolder, album.thumbnail),
        256,
        256
      );
      res.json({ message: "Album thumbnail updated" });
      return;
    }

    const fileName = `${new Date().getTime()}.webp`;

    saveCropImage(thumbnailUrl, path.join(thumbnailFolder, fileName), 256, 256);
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
    res.status(201).json({ message: "Saved" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
