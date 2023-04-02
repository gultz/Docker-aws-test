const db = require('../persistence')


module.exports = async (req,res) => {
    const value2 = req.body.name;
    await db.storeItem(value2);
    console.log(value2)
    return res.json({sucess:true, value:value2});
}