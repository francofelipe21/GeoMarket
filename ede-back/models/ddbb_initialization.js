
const {sequelize, Users, Shops, Categories, Subcategories, Products, Sales} = require('./ddbb_definitions.js');


async function connectToPostgres(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database.\n Error caught:', error);
  }
}


async function createRelationsAmongTables(){
  Users.belongsTo(Shops);
  Shops.hasMany(Users);
  Shops.belongsTo(Categories);
  Categories.hasMany(Shops)
  Subcategories.belongsTo(Categories);
  Categories.hasMany(Subcategories);
  Products.belongsTo(Subcategories);
  Subcategories.hasMany(Products);
  Products.belongsTo(Shops);
  Shops.hasMany(Products);
  Users.hasMany(Sales)
  Sales.belongsTo(Users)
  Sales.belongsTo(Shops)
  Sales.belongsTo(Products)
  await sequelize.sync({ alter: true });
  //await sequelize.sync({ force: true });
}

function createCategories(){
  sequelize.models.categories.findAll().then((e)=>{
    if(e.length === 0){
      sequelize.models.categories.create({ name: "Other"}).then((e)=>{
        let id = e.dataValues.id;
        sequelize.models.subcategories.create({ name: "Other", categoryId:id});
      })
      sequelize.models.categories.create({ name: "Foods"}).then((e)=>{
        let id = e.dataValues.id;
        sequelize.models.subcategories.create({ name: "Fast Food", categoryId:id});
        sequelize.models.subcategories.create({ name: "Drinks", categoryId:id});
      })
      sequelize.models.categories.create({ name: "Clothes"}).then((e)=>{
        let id = e.dataValues.id;
        sequelize.models.subcategories.create({ name: "Formal Wear", categoryId:id});
        sequelize.models.subcategories.create({ name: "Costumes", categoryId:id});
      })
    }
  })
}

function initializeDDBB(){
    connectToPostgres();
    createRelationsAmongTables();
    createCategories()
}

module.exports = {"initializeDDBB": initializeDDBB, "sequelize" : sequelize}