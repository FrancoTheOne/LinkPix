"use strict";
import { Router } from "express";
const router = Router();
import { db } from "../models/index";
import { createAlbumTable } from "../models/GenericAlbum";
import { toKebabCase } from "../utils/stringUtil";

router.get<{}, any, any, {}>("/", async (req, res) => {
  const { count, rows: data } = await db.models.repository.findAndCountAll({
    attributes: ["id", "name"],
  });
  res.json({ data, count });
});

router.post<{}, any, { name: string }>("/", async (req, res) => {
  try {
    const repository = db.models.repository;
    const { name } = req.body;
    const table = `album-${toKebabCase(name)}`;
    const payload = {
      name,
      table,
    };
    await repository.create(payload);
    await createAlbumTable(db, table);

    res.status(201).json({ message: "Created" });
  } catch (err) {
    console.log(err);
  }
});

export default router;
