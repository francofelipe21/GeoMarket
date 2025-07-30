const {sequelize} = require("../models/ddbb_definitions")

async function getPurchases(req, res) {
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
}

module.exports = {"getPurchases":getPurchases}