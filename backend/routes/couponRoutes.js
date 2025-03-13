const express = require("express");
const Coupon = require("../models/Coupon");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Add Coupon
router.post("/add", authMiddleware, async (req, res) => {
  const { code } = req.body;
  const exists = await Coupon.findOne({ code });
  if (exists) return res.status(400).json({ message: "Coupon already exists" });

  const coupon = new Coupon({ code });
  await coupon.save();
  res.json({ message: "Coupon Added" });
});

// View Coupons
router.get("/list", authMiddleware, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

router.post("/claim", async (req, res) => {
  const { ip, code, duration } = req.body;

  let coupon = await Coupon.findOne({ code });

  if (!coupon) return res.status(400).json({ message: "Coupon not found" });

  // Check if coupon is already in use
  if (coupon.isClaimed) {
    // Add user to queue with requested time
    coupon.claimQueue.push({ ip, remainingTime: duration });
    await coupon.save();
    return res.status(200).json({ message: "Added to queue. Please wait..." });
  }

  // Determine allocation time (min of requested time or 60 sec)
  let allocatedTime = Math.min(duration, 60);

  // Assign coupon to user
  coupon.isClaimed = true;
  coupon.claimedBy = ip;
  await coupon.save();

  res.json({ code: coupon.code, expiresIn: allocatedTime });

  // Schedule release after allocated time
  setTimeout(async () => {
    coupon.isClaimed = false;
    coupon.claimedBy = null;

    // Remove current user from queue
    let nextUser = coupon.claimQueue.shift();

    if (nextUser) {
      // If user still has remaining time, put them back in queue
      if (nextUser.remainingTime > allocatedTime) {
        nextUser.remainingTime -= allocatedTime;
        coupon.claimQueue.push(nextUser);
      }

      // Assign to next user
      let nextAllocatedTime = Math.min(nextUser.remainingTime, 60);
      coupon.isClaimed = true;
      coupon.claimedBy = nextUser.ip;

      setTimeout(async () => {
        coupon.isClaimed = false;
        coupon.claimedBy = null;
        coupon.claimQueue.shift(); // Remove user after their time is up
        await coupon.save();
      }, nextAllocatedTime * 1000);
    }

    await coupon.save();
  }, allocatedTime * 1000);
});

module.exports = router;