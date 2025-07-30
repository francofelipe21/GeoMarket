const {sequelize} = require("../models/ddbb_definitions")

async function saveSale(req, res) {
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
}

async function getSales(req, res) {
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
}

module.exports = {"saveSale":saveSale, "getSales":getSales}