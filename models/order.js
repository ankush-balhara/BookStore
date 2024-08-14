const mongoose = require('mongoose')
const order = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'book',
    },
    status:{
        type:String,
        default:'Order Placed',
        enum:['Order Placed','Order Confirmed','Order Shipped','Order Delivered']
    },
        
},
    {timestamps:true}
);

module.exports = mongoose.model('order', order);
