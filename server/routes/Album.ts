"use strict";
import { Router } from "express";
const router = Router();
import { join } from "path";
import { Converter } from "opencc-js";
import models from "../models/Album";
// const { Album, sequelize } = models;
import prefixReducer from "../utils/prefixReducer";
import saveCropImage from "../utils/saveCropImage";
import { Op, DataTypes } from "sequelize";
import { unlink } from "fs";
import { dirname } from "path";
import { sequelize } from "../models/index";

const __dirname = dirname(import.meta.filename);

const zhConverter = Converter({ from: "cn", to: "hk" });
const thumbnailFolder = join(
  __dirname,
  "../../linkpix/public/image/thumbnails"
);

router.post("/test", async (req, res) => {
  const table = req.query.table;
  sequelize.getQueryInterface().createTable(table, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    data: {
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    lastViewAt: {
      type: DataTypes.DATE,
    },
  });
  // Album.sync({ force: true, tableName: "test" });
  // const album = await Album.findOne({
  //   where: { id: req.params.id },
  //   attributes: ["data"],
  // });
  res.json({ user: "world" });
});

router.get("/test", async (req, res) => {
  const table = req.query.table;
  // const { count, rows: data } = await  sequelize.table Album.findAndCountAll({
  //   attributes: [
  //     "id",
  //     "name",
  //     "category",
  //     "author",
  //     "thumbnail",
  //     "source",
  //     "rating",
  //     "lastViewAt",
  //   ],
  //   where: req.query.search
  //     ? {
  //         [Op.or]: [
  //           { name: { [Op.like]: `%${search}%` } },
  //           { author: { [Op.like]: `%${search}%` } },
  //         ],
  //       }
  //     : {},
  //   order: [
  //     [order, direction],
  //     ["id", "DESC"],
  //   ],
  //   offset,
  //   limit,
  // });
  // res.json({ data, count, offset: Number(offset), limit: Number(limit) });
});

router.get("/list", async (req, res) => {
  const offset = parseInt(req.query?.offset) || 0;
  const limit = parseInt(req.query?.limit) || 20;
  const search = req.query.search;
  const order = req.query.order || "id";
  const direction = req.query.direction || "DESC";

  const album = models(sequelize, DataTypes);
  console.log("wtf");

  const { count, rows: data } = await album.findAndCountAll({
    attributes: [
      "id",
      "name",
      "category",
      "author",
      "thumbnail",
      "source",
      "rating",
      "lastViewAt",
    ],
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
    attributes: ["thumbnail"],
  });
  if (!album) {
    res.status(409).json({ message: "Album not found!" });
    return;
  }
  unlink(join(thumbnailFolder, album.thumbnail), (err) => {
    console.log(`${album.thumbnail} is not found`);
  });
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
        join(thumbnailFolder, album.thumbnail),
        256,
        256
      );
      res.json({ message: "Album thumbnail updated" });
      return;
    }

    const fileName = `${new Date().getTime()}.webp`;

    saveCropImage(thumbnailUrl, join(thumbnailFolder, fileName), 256, 256);
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

export default router;
