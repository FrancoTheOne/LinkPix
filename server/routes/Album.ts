"use strict";
import { Router } from "express";
const router = Router();
import { join } from "path";
import { Converter } from "opencc-js";
import { prefixReducer } from "../utils/stringUtil";
import saveCropImage from "../utils/saveCropImage";
import { Op } from "sequelize";
import { unlink } from "fs";
import { dirname } from "path";
import { db } from "../models/index";
import {
  AlbumAttributes,
  AlbumInstnace,
  getAlbumModel,
} from "../models/GenericAlbum";

const __dirname = dirname(import.meta.filename);

const zhConverter = Converter({ from: "cn", to: "hk" });
const thumbFolder = join(__dirname, "../../linkpix/public/image/thumbnails");

router.get<
  { id: string },
  any,
  any,
  {
    offset?: string;
    limit?: string;
    search?: string;
    order?: string;
    direction?: string;
  }
>("/:id", async (req, res) => {
  const offset = parseInt(req.query?.offset) || 0;
  const limit = parseInt(req.query?.limit) || 20;
  const search = req.query?.search;
  const order = req.query.order || "id";
  const direction = req.query.direction || "DESC";

  const album = await getAlbumModel(db, req.params.id);

  const { count, rows: data } = await album.findAndCountAll({
    attributes: [
      "id",
      "title",
      "subtitle",
      "thumb",
      "tags",
      "rating",
      "info",
      "lastViewAt",
    ],
    where: search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { subtitle: { [Op.like]: `%${search}%` } },
            { tags: { [Op.like]: `%${search}%` } },
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

router.get<
  { id: string; itemId: string },
  any,
  any,
  {
    offset?: string;
    limit?: string;
    search?: string;
    order?: string;
    direction?: string;
  }
>("/:id/:itemId", async (req, res) => {
  const { id, itemId } = req.params;
  const album = await getAlbumModel(db, id);
  const item = await album.findOne({
    where: { id: itemId },
  });
  res.json(item);
});

router.patch<{ id: string; itemId: string }, any, Partial<AlbumAttributes>>(
  "/:id/:itemId",
  async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const album = await getAlbumModel(db, id);
      const item = await album.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ message: "Album not found" });
      }
      const result = await album.update(req.body, { where: { id: itemId } });
      res.status(200).json({
        message: "Album updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete<{ id: string; itemId: string }>("/:id", async (req, res) => {
  const { id, itemId } = req.params;
  const album = await getAlbumModel(db, id);
  const item = await album.findOne({
    where: { id: itemId },
    attributes: ["thumb"],
  });
  if (!item) {
    return res.status(409).json({ message: "Album not found!" });
  }
  unlink(join(thumbFolder, item.thumb), (err) => {
    console.log(`${item.thumb} is not found`);
  });
  const result = await album.destroy({
    where: { id: itemId },
  });
  res.json(result);
});

router.put<{ id: string }, any, Partial<AlbumAttributes>>(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { thumb } = req.body;
      const album = await getAlbumModel(db, id);
      const info = JSON.parse(req.body.info);
      const content = JSON.parse(req.body.content);

      if (!info || !("source" in info)) {
        return res.status(400).json({ message: "Insufficient data" });
      }

      const item = await album.findOne({
        where: { "info.source": info?.source },
      });
      if (item && thumb) {
        saveCropImage(thumb, join(thumbFolder, item.thumb), 180, 270);
        return res.json({ message: "Album thumbnail updated" });
      }

      const fileName = thumb ? `${new Date().getTime()}.webp` : "";
      if (thumb) {
        saveCropImage(thumb, join(thumbFolder, fileName), 180, 270);
      }
      const title = zhConverter(req.body.title);
      const payload: Partial<AlbumAttributes> = {
        title,
        subtitle: title,
        thumb: fileName,
        tags: "",
        rating: 0,
        info: info,
        content: JSON.stringify({
          ...content,
          img: prefixReducer(content.img),
        }),
      };
      await album.create(payload);
      res.status(201).json({ message: "Saved" });
    } catch (err) {
      console.log(err);
    }
  }
);

export default router;
