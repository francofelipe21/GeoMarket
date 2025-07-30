const {sequelize} = require("../models/ddbb_definitions")

async function saveProduct(req, res) {
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
}

async function getSubcategories(req, res) {
    sequelize.models.subcategories.findAll({"where":{"categoryId":req.body.categoryId}}).then(
        (sql_response)=>{
            let array=[]
            for(let index=0; index<sql_response.length; index=index+1){
                let id = sql_response[index].dataValues.id;
                let name = sql_response[index].dataValues.name;
                array.push({"name":name, "id":id})
            }
            res.json({"response":array})
        });
}

async function getCategories(req, res) {
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

module.exports = {"saveProduct":saveProduct, "getSubcategories":getSubcategories, "getCategories":getCategories}