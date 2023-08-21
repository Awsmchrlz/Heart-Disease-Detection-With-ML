const mongoose = require("mongoose");

const PatientTest = new mongoose.Schema({
  inputList: {
    type: String,
    required: true,
  },
  result:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("PatientTest", UserSchema);
