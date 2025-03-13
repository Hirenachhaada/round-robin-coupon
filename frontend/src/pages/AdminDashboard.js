import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coupons/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCoupons(res.data));
  }, [token]);

  const addCoupon = async () => {
    await axios.post(
      "http://localhost:5000/api/coupons/add",
      { code },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Coupon Added");
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "./";
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input
        type="text"
        placeholder="Coupon Code"
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={addCoupon}>Add Coupon</button>
      <ul>
        {coupons.map((c) => (
          <li key={c._id}>
            {c.code} - {c.isClaimed ? "Claimed" : "Available"}
          </li>
        ))}
      </ul>
      <button onClick={logout}> Log Out </button>
    </div>
  );
};

export default AdminDashboard;
