"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _user = _interopRequireDefault(require("../models/user.js"));
var _product = _interopRequireDefault(require("../models/product.js"));
var _snackStore = _interopRequireDefault(require("../models/snackStore.js"));
var _messages = _interopRequireDefault(require("../models/messages.js"));
var _multer = _interopRequireDefault(require("multer"));
var _fs = _interopRequireDefault(require("fs"));
var _uuid = require("uuid");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// import ensureAuthenticated from '../../config/auth';
// import passport from 'passport';

// ensureAuthenticated,

require('dotenv').config();

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});
console.log(cloudinary.config().cloud_name);
// var storage = multer.memoryStorage()

var storage = _multer.default.diskStorage({
  limits: {
    fieldSize: 10 * 1024 * 1024
  },
  destination: function (req, file, cb) {
    cb(null, `./uploads`);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

//uploadImage('./uploads/image.jpg')

var upload = (0, _multer.default)({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
const router = (0, _express.default)();
router.get('/', (req, res) => {
  // res.send(req.body);
  _user.default.find({}).lean().then(users => {
    let pendingOrders = [];
    let deletedOrders = [];
    let canceledOrders = [];
    let processedOrders = [];
    let userMessages = [];
    let currUsers = [];
    let products = [];
    _messages.default.find({}).lean().then(messages => {
      messages.forEach(message => {
        userMessages.push(message);
      });
      users.forEach(user => {
        currUsers.push(user);
        user.orders.forEach(order => {
          if (order.orderStatus == 'Pending') {
            pendingOrders.push(order);
          }
          if (order.orderStatus == 'Cancelled') {
            canceledOrders.push(order);
          }
          if (order.orderStatus == 'Deleted') {
            deletedOrders.push(order);
          }
          if (order.orderStatus == 'Processed') {
            processedOrders.push(order);
          }
        });
      });
      _product.default.find({}).then(batchList => {
        batchList.forEach(batch => {
          batch.products.forEach(product => {
            products.push(product);
          });
        });
        res.render('admin', {
          style: "admin.css",
          script: "admin",
          pendingOrders,
          deletedOrders,
          canceledOrders,
          userMessages,
          users: currUsers,
          products,
          processedOrders
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
});
router.post('/uploadItem', upload.array('photos', 3), async (req, res) => {
  try {
    const files = req.files;
    const imageUrls = [];
    for (let i = 0; i < files.length; i++) {
      //Uploading the files to cloudinary and getting the URLs
      const result = await cloudinary.uploader.upload(files[i].path);
      imageUrls.push(result.url);
    }
    const {
      itemClass,
      itemPrice,
      itemName,
      itemTags,
      itemInfo
    } = req.body;
    let newProduct = {
      itemClass,
      itemPrice,
      itemId: (0, _uuid.v4)(),
      itemName,
      itemTags,
      itemInfo,
      quantity: 0,
      imageUrls
    };
    console.log(newProduct);
    _product.default.updateOne({
      batchClass: itemClass
    }, {
      $push: {
        products: newProduct
      }
    }).then(batch => {
      console.log(batch);
      if (batch.modifiedCount == 0) {
        const products = [newProduct];
        const batchClass = itemClass;
        const newBatch = new _product.default({
          batchClass,
          products
        });
        newBatch.save((err, result) => {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            console.log('product saved');
            res.render('admin', {
              style: "admin.css",
              script: "admin",
              response: "New Post Successful"
            });
            deleteFiles(req.files);
            return;
          }
        });
      } else {
        res.render('admin', {
          style: "admin.css",
          script: "admin",
          response: "Post Class Append Successful"
        });
        return;
      }
    });
  } catch {}
});
router.post('/sendPublicMessage', (req, res) => {
  const {
    messageTitle,
    from,
    messageBody
  } = req.body;
  let date = new Date().toLocaleString();
  let newNotification = {
    messageType: messageTitle,
    messageBody,
    from,
    messageDate: date
  };
  _user.default.updateMany({}, {
    $push: {
      notifications: newNotification
    }
  }).then(result => {
    console.log(result);
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
  });
});
router.post('/replyUser', (req, res) => {
  const {
    replyText,
    userId
  } = req.body;
  let date = new Date().toLocaleString();
  let newNotification = {
    messageType: "Reply",
    messageBody: replyText,
    from: 'Snackbin Team',
    messageDate: date
  };
  _user.default.updateOne({
    _id: userId
  }, {
    $push: {
      notifications: newNotification
    }
  }).then(result => {
    console.log(result);
    res.redirect('/admin');
  }).catch(err => {
    console.log(err);
  });
});
router.post('/setStoreState', (req, res) => {
  const {
    storeId,
    storeState
  } = req.body;
  _snackStore.default.updateOne({
    storeId: storeId
  }, {
    $set: {
      storeState: storeState
    }
  }).then(ress => {
    if (ress.matchedCount > 0) {
      res.json({
        response: `Store State Updated`
      });
    } else {
      res.json({
        response: `Store Id Does Not Match`
      });
    }
  }).catch(err => {
    res.json(err);
  });
});
router.post('/setStoreMessage', (req, res) => {
  const {
    storeId,
    storeText
  } = req.body;
  console.log(storeId);
  _snackStore.default.updateOne({
    storeId: storeId
  }, {
    $set: {
      storeText: storeText
    }
  }).then(ress => {
    if (ress.matchedCount > 0) {
      res.json({
        response: `Store Message Updated`
      });
    } else {
      res.json({
        response: `Store Id Does Not Match`
      });
    }
  }).catch(err => {
    res.json(err);
  });
});
router.post('/createStore', (req, res) => {
  const {
    storeName,
    storeId,
    storeLocation,
    storeCoordinates,
    storeInfo
  } = req.body;
  let storeText = 'new Store';
  const newStore = new _snackStore.default({
    storeName,
    storeId,
    storeLocation,
    storeCoordinates,
    storeInfo,
    storeText
  });
  newStore.save((err, result) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('store saved');
      res.redirect('/admin');
    }
  });
});
function deleteFiles(filePaths) {
  filePaths.forEach(file => {
    _fs.default.unlink(file.path, err => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    });
  });
}
var _default = router;
exports.default = _default;