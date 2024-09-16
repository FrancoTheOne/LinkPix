"use strict";
import { DataTypes, Model, ModelStatic, Optional } from "sequelize";
import { type db } from ".";
import { RepositoryInstnace } from "./Repository";

export interface AlbumAttributes {
  id: number;
  title: string;
  subtitle: string;
  action: string;
  thumb: string;
  tags: string;
  rating: number;
  info: string;
  content: string;
  lastViewAt: Date;
}
interface AlbumCreationAttributes extends Optional<AlbumAttributes, "id"> {}

export interface AlbumInstnace
  extends Model<AlbumAttributes, AlbumCreationAttributes>,
    AlbumAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const modelAttributes = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  subtitle: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
  },
  thumb: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.INTEGER,
  },
  info: {
    type: DataTypes.JSON,
  },
  content: {
    type: DataTypes.JSON,
  },
  lastViewAt: {
    type: DataTypes.DATE,
  },
};

const getAlbumModel = async (
  db: db,
  tableId: string
): Promise<ModelStatic<AlbumInstnace>> => {
  if (tableId in db.models) {
    return db.models[tableId] as ModelStatic<AlbumInstnace>;
  } else {
    const album = await (
      db.models.repository as ModelStatic<RepositoryInstnace>
    ).findOne({
      attributes: ["table"],
      where: { id: tableId },
    });
    if (album === null) {
      throw new Error(`Invalid tableId: ${tableId}`);
    }

    const model = db.sequelize.define<AlbumInstnace>(
      album.table,
      modelAttributes,
      { freezeTableName: true }
    );
    db.models[model.name] = model;
    return model;
  }
};

const createAlbumTable = async (db: db, tableName: string) => {
  const model = db.sequelize.define<AlbumInstnace>(tableName, modelAttributes, {
    freezeTableName: true,
  });
  db.sequelize.sync({ alter: true });
  db.models[model.name] = model;
};

export { getAlbumModel, createAlbumTable };
