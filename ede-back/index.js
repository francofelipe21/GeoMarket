const express = require("express");
var cors = require('cors');
const multer = require('multer');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('postgres', 'postgres', 'franco1234', {
  host: 'localhost',
  dialect: 'postgres'
  });

  var profiles_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/profiles_pictures')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.email+'.jpg')
    }
  })

  var shops_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/shops_pictures')
    },
    filename: function (req, file, cb) {
      console.log(req)
      cb(null, req.body.email+'.jpg')
    }
  })

  var products_pictures_storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/products_pictures')
    },
    filename: function (req, file, cb) {
      console.log(req)
      cb(null, req.body.email+"_"+req.body.name+'.jpg')
    }
  })

  const upload = multer({
    storage: profiles_pictures_storage,
    limits:{fileSize:'1000000'},
    fileFilter:(req, file, callback)=>{
        const fileType = /jpeg|jpg|png|gif/
        const mimeType = fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))
        if(mimeType && extname){
            return callback(null, true)
        }
        callback('Give proper file format to upload')
    }
  })

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(express.static('./files'));

async function saveNewUser(req){
  let fullname = req.body.fullname;
  let email = req.body.email;
  let phonenumber = req.body.phonenumber_code + req.body.phonenumber;
  let sell = req.body.provider_type;
  let buy = req.body.client_type;
  let has_picture = req.body.has_picture
  let password = req.body.password;
  password = await bcrypt.hash(password, 10);
  try{
    const new_user = await sequelize.models.users.create({ fullname: fullname, email:email, phonenumber:phonenumber, sell:sell, buy:buy, has_picture:has_picture, password:password});
    return {"successfull":true, "message":null}
  }
  catch(error){
    let message = null;
    if(error.message=="llave duplicada viola restricción de unicidad «users_email_key»"){
      message = "The email belongs to other user"
    }
    return {"successfull":false, "message":message}
  }
}

async function saveNewShop(req) {
  let name = req.body.name;
  let shop_category = req.body.shop_category;
  let positions = req.body.positions.split(',');
  let array_positions=[]
  for(let index=0; index+1<positions.length; index=index+2){
    array_positions.push([positions[index], positions[index+1]])
  }
  const points = {
    type: 'Polygon',
    coordinates: [array_positions]
  };
  //try{
    if(positions.length>0){
      const new_shop = await sequelize.models.shops.create({ name: name, categoryId:shop_category, positions:points, has_picture:req.body.has_shop_picture});
      return {"successfull":true, "id":new_shop.dataValues.id}
    }
    else{
      const new_shop = await sequelize.models.shops.create({ name: name, categoryId:shop_category, has_picture:req.body.has_shop_picture});
      return {"successfull":true, "id":new_shop.dataValues.id}
    }
  //}
  //catch(error){
  //  return {"successfull":false, "id":0}
  //}
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

async function authenticateUser(req) {
  let email = req.body.email;
  let password = req.body.password;
  let response = await sequelize.models.users.findAll({where:{email:email}});
  if(response.length === 0){
    return {"valid" : false}
  }
  let is_valid = false;
  for(let index=0; index<response.length; index=index+1){
    if(await comparePassword(password, response[index].password)){
      is_valid = true;
      break;
    }
  }
  let has_picture = response[0].dataValues.has_picture
  let name = response[0].dataValues.fullname
  let is_provider = response[0].dataValues.sell
  let is_client = response[0].dataValues.buy
  let shop_id = response[0].dataValues.shopId
  if(shop_id !== null){
    let shop_response = await sequelize.models.shops.findAll({where:{id:shop_id}});
    let shop_name = shop_response[0].dataValues.name;
    let has_shop_picture = shop_response[0].dataValues.has_picture;

    return {"valid":is_valid, "has_picture":has_picture, "name":name, "is_client":is_client, "is_provider":is_provider, "shop_name":shop_name, "has_shop_picture":has_shop_picture, "shop_id":shop_id}
  }
  return {"valid":is_valid, "has_picture":has_picture, "name":name, "is_client":is_client, "is_provider":is_provider, "shop_name":"", "has_shop_picture":false, "shop_id":0}
}

app.post("/authenticate", (req, res)=>{
  console.log("authentication");
  authenticateUser(req).then(e=>{res.json({valid_authentication:e.valid, name:e.name, has_picture:e.has_picture, is_client:e.is_client, is_provider:e.is_provider, shop_name:e.shop_name, has_shop_picture:e.has_shop_picture, shop_id:e.shop_id})})
})

async function getUserData(email){
  let user = await sequelize.models.users.findAll({where:{email:email}});
  console.log(user)
  user = user[0].dataValues;
  let current_portal = "client"
  if(user.sell && !user.buy){
    current_portal = "provider"
  }
  const shop_id = user.shopId
  let shop_response = await sequelize.models.shops.findAll({where:{id:shop_id}});
  shop_response = shop_response[0].dataValues
  let shop_name = shop_response.name
  let has_shop_picture = shop_response.has_picture
  return {"name":user.fullname, "has_picture":user.has_picture, "is_client":user.buy, "is_provider":user.sell, "current_portal":current_portal, "shop_name":shop_name, "has_shop_picture":has_shop_picture}
}

app.post("/get_user_data", (req, res)=>{
  let email = req.body.email;
  console.log(email)
  getUserData(email).then(e=>{res.json({name:e.name, has_picture:e.has_picture, is_client:e.is_client, is_provider:e.is_provider, current_portal:e.current_portal, shop_name:e.shop_name, has_shop_picture:e.has_shop_picture})})
})

app.post("/save_new_user", upload.single('profile_picture'), (req, res) => {
    saveNewUser(req).then(response => res.json({successfull: response.successfull, message: response.message }));
  });

app.post("/save_new_shop",  multer({
  storage: shops_pictures_storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, callback)=>{
      const fileType = /jpeg|jpg|png|gif/
      const mimeType = fileType.test(file.mimetype)
      const extname = fileType.test(path.extname(file.originalname))
      if(mimeType && extname){
          return callback(null, true)
      }
      callback('Give proper file format to upload')
  }
}).single("shop_picture"), (req, res) => {
    saveNewShop(req).then(response => {console.log(response);res.json({successfull: response.successfull, shop_id:response.id})});
});

app.post("/save_new_product", multer({
  storage: products_pictures_storage,
  limits:{fileSize:'1000000'},
  fileFilter:(req, file, callback)=>{
      const fileType = /jpeg|jpg|png|gif/
      const mimeType = fileType.test(file.mimetype)
      const extname = fileType.test(path.extname(file.originalname))
      if(mimeType && extname){
          return callback(null, true)
      }
      callback('Give proper file format to upload')
  }}).single("product_picture"), async (req, res)=>{
    let name=req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let has_picture = req.body.has_picture;
    let shop_id = req.body.shop_id;
    let subcategory_id = req.body.subcategory_id;
    console.log("subcategory id ", subcategory_id)
    console.log("shop id ", shop_id)    
    try{
      await sequelize.models.products.create({ name: name, description: description, price:price, has_picture:has_picture, shopId:shop_id, subcategoryId:subcategory_id})
      res.json({"successfull":true})
    }
    catch(error){
      res.json({"successfull":false})
    }
})

app.post("/save_new_sale", (req, res)=>{
  console.log(req.body)
  sequelize.models.users.findOne({where:{email:req.body.email}}).then((query_response)=>{
    console.log(query_response)
    let user_id = query_response.id
    let sale_data = {userId: user_id, has_dispatch:req.body.has_dispatch ,amount:req.body.amount, quantity:req.body.quantity, address:req.body.address, delivery_date:req.body.delivery_date, shopId:req.body.shop_id, productId:req.body.product_id}
    try{
      sequelize.models.sales.create(sale_data).then(()=>{
        res.json({"successfull":true})
      })
    }
    catch(error){
      console.log(error)
      res.json({"successfull":false})
    }
  })
})

app.post("/get_sales", (req, res)=>{
  sequelize.models.users.findOne({where:{email:req.body.email}}).then((sql_response)=>{
    let shop_id = sql_response.shopId;
    sequelize.models.sales.findAll({where:{shopId:shop_id}, include: [sequelize.models.users, sequelize.models.products, sequelize.models.shops]}).then((sales)=>{
      let response_array = []
      for(let index=0; index < sales.length; index = index + 1){
        let response_dict = {}
        response_dict.client_name = sales[index].user.fullname;
        response_dict.product_name = sales[index].product.name;
        response_dict.has_dispatch = sales[index].has_dispatch;
        response_dict.address = sales[index].address;
        response_dict.quantity = sales[index].quantity;
        response_dict.amount = sales[index].amount;
        response_dict.delivery_date = sales[index].delivery_date;
        response_array.push(response_dict)
      }
      res.json({sales:response_array})
    })
  })
})

app.post("/get_purchases", (req, res)=>{
  sequelize.models.users.findOne({where:{email:req.body.email}}).then((sql_response)=>{
    let my_id = sql_response.id;
    
    sequelize.models.sales.findAll({where:{userId:my_id}, include: [sequelize.models.users, sequelize.models.products, sequelize.models.shops]}).then(async (sales)=>{
      var response_array = []
      for(let index=0; index < sales.length; index = index + 1){
        await sequelize.models.users.findOne({where:{shopId:(sales[index].shop.id)}}).then((sql_response)=>{
          let email = sql_response.dataValues.email
          return email
        }).then((email)=>{
          var response_dict = {}
          response_dict.client_name = sales[index].user.fullname;
          response_dict.product_name = sales[index].product.name;
          response_dict.has_dispatch = sales[index].has_dispatch;
          response_dict.address = sales[index].address;
          response_dict.quantity = sales[index].quantity;
          response_dict.amount = sales[index].amount;
          response_dict.delivery_date = sales[index].delivery_date;
          response_dict.shop_name = sales[index].shop.name;
          response_dict.email= email
          response_array.push(response_dict)
        });
      }
      console.log(response_array)
      res.json({sales:response_array})
    })
  })
})

app.post("/get_shops_positions",(req, res)=>{
  sequelize.models.shops.findAll({include: [sequelize.models.users, sequelize.models.categories]}).then((sql_response)=>{
    let response = [];
    for(let index=0; index<sql_response.length; index = index + 1){  
      if(sql_response[index].positions.coordinates.length > 0){
        let shop_id = sql_response[index].id;
        let shop_name = sql_response[index].name;
        let has_picture = sql_response[index].has_picture;
        let shop_category = sql_response[index].category.name;
        let sellers = sql_response[index].users;
        let seller_email = ""
        if(sellers.length > 0){
          seller_email = sellers[0].email;
        }
        let shop_positions = sql_response[index].positions.coordinates[0];
        response.push({"id":shop_id, "shop_category":shop_category, "seller_email":seller_email, "name":shop_name, "positions":shop_positions, "has_picture":has_picture})
      }
    }
    res.json({"response":response})
  });
})

app.post("/get_shop_products", (req, res)=>{
  let shop_id = req.body.shop_id;
  sequelize.models.products.findAll({"where":{"shopId":shop_id}}).then((sql_response)=>{
    res.json({"response":sql_response})
  })
})

app.post("/get_categories",(req, res)=>{
  sequelize.models.categories.findAll().then((sql_response)=>{
    let array=[]
    for(let index=0; index<sql_response.length; index=index+1){
      let id = sql_response[index].dataValues.id;
      let name = sql_response[index].dataValues.name;
      array.push({"name":name, "id":id})
    }
    res.json({"response":array})
  });
})

app.post("/get_shop_image",(req, res)=>{
  let shop_id = req.body.shop_id;
  sequelize.models.users.findAll({"where":{"shopId":shop_id}}).then((sql_response)=>{
    if(sql_response.length > 0){
      let email = sql_response[0].email
      res.json({"path":"http://localhost:3001/shops_pictures/"+email+".jpg"})
    }
  });
})

app.post("/get_subcategories",(req, res)=>{
  console.log(req.body.categoryId)
  sequelize.models.subcategories.findAll({"where":{"categoryId":req.body.categoryId}}).then((sql_response)=>{
    let array=[]
    for(let index=0; index<sql_response.length; index=index+1){
      let id = sql_response[index].dataValues.id;
      let name = sql_response[index].dataValues.name;
      array.push({"name":name, "id":id})
    }
    res.json({"response":array})
  });
})

app.post("/update_user_shop", async (req,res)=>{
  try{
    let email = req.body.email;
  await sequelize.models.users.update(
    { shopId: req.body.shop_id },
    {
      where: {
        email: req.body.email,
      },
    },
  );
  res.json({"successfull":true})
  }
  catch(error){
    res.json({"successfull":false})
  }

})

async function connectToPostgres(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function createTable(){
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
  //await sequelize.sync({ alter: true });
  //await sequelize.sync({ force: true });
  const point = {
    type: 'Polygon',
    coordinates: [[[49.019994, 8.413086], [49.019991, 8.413016]]]
};
  createCategories()
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  connectToPostgres()
  createTable();
});