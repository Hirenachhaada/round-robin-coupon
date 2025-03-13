import React, { useState } from "react";
import axios from "axios";

const UserPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [duration, setDuration] = useState("");
  const [message, setMessage] = useState("");

  const claimCoupon = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/coupons/claim", {
        ip: "test-ip", // Replace with actual IP tracking
        code: couponCode,
        duration: Number(duration),
      });

      setMessage(
        res.data.message ||
          `Coupon ${res.data.code} granted for ${res.data.expiresIn} seconds.`
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Error claiming coupon.");
    }
  };

  return (
    <div>
      <h2>Claim Your Coupon</h2>
      <input
        type="text"
        placeholder="Enter Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={claimCoupon}>Claim Coupon</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserPage;
