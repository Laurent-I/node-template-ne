const { PrismaClient } = require("@prisma/client");

const mysqlPrisma = new PrismaClient();

module.exports = {
  mysqlPrisma,
};
