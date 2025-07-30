const { Sequelize, DataTypes } = require('sequelize');
const { database_name, database_username, database_user_password, my_host } = require('../config/development');


const sequelize = new Sequelize(database_name, database_username, database_user_password, {
    host: my_host,
    dialect: 'postgres'
});

const Users = sequelize.define('users', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email : {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phonenumber: {
      type: DataTypes.STRING
    },
    buy: {
      type: DataTypes.BOOLEAN
    },
    sell: {
      type: DataTypes.BOOLEAN
    },
    has_picture: {
      type: DataTypes.BOOLEAN
    },
    password: {
      type: DataTypes.STRING
    },
  }, {freezeTableName: true});


const Shops = sequelize.define('shops', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    positions:{
      type: Sequelize.GEOMETRY('POLYGON'),
      allowNull: true
    },
    has_picture: {
      type: DataTypes.BOOLEAN
    }
  }, {freezeTableName: true});


const Categories = sequelize.define('categories', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {freezeTableName: true});

const Subcategories = sequelize.define('subcategories', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {freezeTableName: true});

const Products = sequelize.define('products', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    has_picture: {
      type: DataTypes.BOOLEAN
    }
  }, {freezeTableName: true});

const Sales = sequelize.define('sales', {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity:{
      type: DataTypes.FLOAT,
      allowNull: false
    },
    has_dispatch: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {freezeTableName: true});

module.exports = {"sequelize":sequelize,"Users":Users, "Shops":Shops, "Categories":Categories, 
    "Subcategories":Subcategories, "Products":Products, "Sales":Sales}
