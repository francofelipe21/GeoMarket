const {sequelize} = require("../models/ddbb_definitions")
const bcrypt = require('bcrypt');

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

async function updateShop(req, res) {
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
}

module.exports = {"saveNewUser":saveNewUser, "authenticateUser":authenticateUser, 
  "getUserData":getUserData, "updateShop":updateShop}