"use strict";
import {
  DataTypes,
  Model,
  ModelStatic,
  Optional,
  type Sequelize,
} from "sequelize";

export interface RepositoryAttributes {
  id: number;
  name: string;
  table: string;
}
interface RepositoryCreationAttributes
  extends Optional<RepositoryAttributes, "id"> {}

export interface RepositoryInstnace
  extends Model<RepositoryAttributes, RepositoryCreationAttributes>,
    RepositoryAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const getRepositoryModel = (
  sequelize: Sequelize
): ModelStatic<RepositoryInstnace> => {
  const model = sequelize.define<RepositoryInstnace>(
    "repository",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      table: {
        type: DataTypes.STRING,
      },
    },
    { freezeTableName: true }
  );
  return model;
};

export { getRepositoryModel };
