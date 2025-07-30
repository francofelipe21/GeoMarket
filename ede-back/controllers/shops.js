const {sequelize} = require("../models/ddbb_definitions")

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
  try{
    if(positions.length>0){
      const new_shop = await sequelize.models.shops.create({ name: name, categoryId:shop_category, positions:points, has_picture:req.body.has_shop_picture});
      return {"successfull":true, "id":new_shop.dataValues.id}
    }
    else{
      const new_shop = await sequelize.models.shops.create({ name: name, categoryId:shop_category, has_picture:req.body.has_shop_picture});
      return {"successfull":true, "id":new_shop.dataValues.id}
    }
  }
  catch(error){
    return {"successfull":false, "id":0}
  }
}

async function getPositions(req, res) {
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
}

async function getProducts(req, res) {
    let shop_id = req.body.shop_id;
    sequelize.models.products.findAll({"where":{"shopId":shop_id}}).then((sql_response)=>{
        res.json({"response":sql_response})
    })
}

async function getShopCategories(req, res) {
    sequelize.models.categories.findAll().then((sql_response)=>{
        let array=[]
        for(let index=0; index<sql_response.length; index=index+1){
            let id = sql_response[index].dataValues.id;
            let name = sql_response[index].dataValues.name;
            array.push({"name":name, "id":id})
        }
        res.json({"response":array})
    });
}

async function getShopImage(req, res) {
    let shop_id = req.body.shop_id;
    sequelize.models.users.findAll({"where":{"shopId":shop_id}}).then((sql_response)=>{
        if(sql_response.length > 0){
            let email = sql_response[0].email
            res.json({"path":"http://localhost:3001/shops_pictures/"+email+".jpg"})
        }
    });
}

module.exports = {"saveNewShop":saveNewShop, "getPositions":getPositions, "getProducts":getProducts, 
    "getShopCategories":getShopCategories, "getShopImage":getShopImage}