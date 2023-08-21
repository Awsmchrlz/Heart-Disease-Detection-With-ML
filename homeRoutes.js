"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = _interopRequireDefault(require("../models/user.js"));
var _seller = _interopRequireDefault(require("../models/seller.js"));
var _messages = _interopRequireDefault(require("../models/messages.js"));
var _publicPost = _interopRequireDefault(require("../models/publicPost.js"));
var _snackStore = _interopRequireDefault(require("../models/snackStore.js"));
var _product = _interopRequireDefault(require("../models/product.js"));
var _functions = require("./functions.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 

// import fetch from 'cross-fetch'

const router = (0, _express.default)();
router.get('/', (req, res) => {
  console.log('req');
  _snackStore.default.find({}).lean().then(stores => {
    res.render('home', {
      style: "styles.css",
      script: "main",
      stores
    });
  }).catch(err => {
    console.log(err);
  });
});
router.get('/publicMarket', (req, res) => {
  _snackStore.default.find({}).lean().then(stores => {
    res.render('publicMarket', {
      style: "publicMarket.css",
      script: "publicMarket"
    });
  }).catch(err => {
    console.log(err);
  });
});
router.get('/sellerDashboard', (req, res) => {
  _snackStore.default.find({}).lean().then(stores => {
    res.render('sellerDashboard', {
      style: "sellerDash.css",
      script: "sellerDash"
    });
  }).catch(err => {
    console.log(err);
  });
});
router.get('/donate', (req, res) => {
  _snackStore.default.find({}).lean().then(stores => {
    res.render('donate', {
      style: "styles.css",
      script: "main"
    });
    return;
  }).catch(err => {
    console.log(err);
    return;
  });
});
router.get('/invest', (req, res) => {
  _snackStore.default.find({}).lean().then(stores => {
    res.render('invest', {
      style: "styles.css",
      script: "main"
    });
    return;
  }).catch(err => {
    console.log(err);
    return;
  });
});
router.post('/makeOrder', (req, res) => {
  console.log(req.body);
  const {
    delivery,
    Cart,
    tip,
    orderNotes,
    payMethod,
    payNumber,
    userName,
    userId
  } = req.body;
  console.log(userId);
  let date = new Date().toLocaleString();
  let orderId = Date.now().toString().slice(7, 13);
  console.log(date);
  let userOrder = {
    orderId,
    orderCost: calcCost(Cart),
    orderTime: date,
    orderStatus: 'Pending',
    Cart,
    tip,
    payMethod,
    delivery,
    orderNotes,
    payNumber,
    userName,
    userId
  };
  _user.default.updateOne({
    _id: req.body.userId
  }, {
    $push: {
      orders: userOrder
    }
  }).then(user => {
    let userOrders = user.orders;
    console.log('saved');
    res.json({
      response: 'Thank you, We have recieved your order✅'
    });
    return;
  }).catch(err => {
    console.log(err);
    res.json({
      response: err
    });
    return;
  });
});
router.get('/getStoreData/:name', (req, res) => {
  const storeId = req.params.name;
  _snackStore.default.findOne({
    storeId: storeId
  }).then(storeData => {
    res.json(storeData);
    return;
  }).catch(err => {
    console.log(err);
    return;
  });
});
router.get('/fetchStock', (req, res) => {
  let batchList = [];
  _product.default.find({}).then(bactches => {
    bactches.forEach(batch => {
      batchList.push(batch);
    });
    res.json(batchList);
    return;
  });
});
router.get('/fetchPublic', (req, res) => {
  let publicPosts = [];
  _publicPost.default.find({}).then(publicPost => {
    publicPost.forEach(post => {
      publicPosts.push(post);
    });
    res.json(publicPosts);
    return;
  });
});
router.get('/fetchSellerData/:sellerId', (req, res) => {
  const sellerId = req.params.sellerId;
  console.log(sellerId);
  _seller.default.findOne({
    sellerId: sellerId
  }).then(seller => {
    console.log(seller);
    res.json({
      sellerLocation: seller.sellerLocation,
      sellerName: seller.sellerName,
      sellerNumber: seller.sellerNumber
    });
  }).catch(err => {
    console.log(err);
  });
  return;
});
router.post('/getProfile', (req, res) => {
  console.log(req.body);
  const {
    id
  } = req.body;
  let userNotifications = [];
  let userOrders = [];
  _user.default.findOne({
    _id: id
  }).then(user => {
    const data = {
      userName: user.userName,
      _id: user._id,
      userNumber: user.userNumber,
      userAddress: user.userAddress,
      userOrders: user.orders,
      userNotifications: user.notifications,
      email: user.email
    };
    res.json(data);
  }).catch(err => {
    const data = {
      userName: '',
      _id: '',
      userNumber: '',
      userAddress: '',
      userOrders,
      userNotifications
    };
    res.json({
      data,
      err
    });
  });
});
router.post('/getSellerProfile', (req, res) => {
  const {
    id
  } = req.body;
  _seller.default.findOne({
    sellerId: id
  }).then(seller => {
    res.json(seller);
    return;
  }).catch(err => {
    console.log(err);
    return;
  });
});
router.post('/createSeller', (req, res) => {
  const {
    sellerId,
    sellerName,
    sellerNumber,
    sellerLocation
  } = req.body;
  console.log(sellerId + sellerName + sellerNumber);
  const newSeller = new _seller.default({
    sellerId,
    sellerName,
    sellerNumber,
    sellerLocation
  });
  if ((0, _functions.validatePhoneNumber)(sellerNumber) && (0, _functions.validateUsername)(sellerName)) {
    newSeller.save((err, result) => {
      if (err) {
        console.log('failed' + err);
        res.json({
          response: err
        });
      } else {
        res.json({
          response: "Account Created"
        });
        console.log('created' + result);
        return;
      }
    });
  } else {
    res.json({
      error: "Enter Valid Details"
    });
    return;
  }
});
router.post('/updateOrder', (req, res) => {
  const {
    userId,
    orderId,
    orderState
  } = req.body;
  _user.default.findOne({
    _id: userId
  }).then(user => {
    console.log(orderId);
    let revOrders = user.orders;
    revOrders.forEach((order, index) => {
      if (order.orderId == orderId) {
        // console.log(order)
        if(orderState=='erase'){
          revOrders.splice(index,1);
        }else{
          order.orderStatus = orderState;
        }
      }
     
    });
    //console.log(revOrders)
    _user.default.updateOne({
      _id: userId
    }, {
      $set: {
        orders: revOrders
      }
    }).then(() => {
      // console.log('Deleted')
      res.json({
        data: 'as'
      });
    });
  }).catch(err => {
    console.log('err');
  });
});
router.post('/message', (req, res) => {
  const {
    text,
    userId,
    senderName,
    senderNumber
  } = req.body;
  let date = new Date().toLocaleString();
  const message = new _messages.default({
    text,
    userId,
    senderName,
    senderNumber,
    date
  });
  message.save((err, result) => {
    console.log(err);
    if (err) {
      console.log(result);
      return;
    } else {
      console.log(result);
      res.json({
        response: "Message Recieved, watch your notifications for our reply."
      });
      return;
    }
  });
});
function calcCost(userCart) {
  let total = 0;
  userCart.forEach(item => {
    total = total + item.itemPrice * item.quantity;
  });
  return total;
}
var _default = router;
exports.default = _default;