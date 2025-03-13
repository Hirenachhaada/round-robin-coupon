const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  isClaimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null },
  claimQueue: [{ ip: String, requestedTime: Number }],
});

module.exports = mongoose.model("Coupon", CouponSchema);
