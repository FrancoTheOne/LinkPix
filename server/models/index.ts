"use strict";
import { basename as _basename } from "path";
import { Model, ModelStatic, Sequelize } from "sequelize";
import { env as _env } from "process";
import configList from "../config/config.json" assert { type: "json" };
import { getRepositoryModel } from "./Repository";

const env = _env.NODE_ENV || "development";
const config = configList[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(_env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

interface db {
  sequelize: Sequelize;
  models: Partial<Record<string, ModelStatic<Model>>>;
}

const db = {
  sequelize,
  models: {
    repository: getRepositoryModel(sequelize),
  },
};

export { db };
