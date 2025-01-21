import React, { useState } from "react";
import styles from "./styles/Redeem.module.css";
import { useNavigate } from "react-router-dom";

const Redeem = () => {
  const availablePoints = 1000;
  const [redeemPoints, setRedeemPoints] = useState("");
  const [mode, setMode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRedeem = () => {
    setError("");
    const points = parseInt(redeemPoints, 10);

    if (!redeemPoints || isNaN(points) || points <= 0) {
      setError("Please enter a valid number of points.");
      return;
    }

    if (points > availablePoints) {
      setError("You cannot redeem more points than available.");
      return;
    }

    if (!mode) {
      setError("Please select a mode of redemption.");
      return;
    }

    if (mode === "UPI" && !upiId) {
      setError("Please enter a valid UPI ID.");
      return;
    }

    navigate("/success", { state: { points, mode, upiId } });
  };

  return (
    <div className={styles.redeemContainer}>
      <h2 className={styles.title}>Redeem Your Points</h2>
      <p className={styles.availablePoints}>
        Available Points: <strong>{availablePoints}</strong>
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="points" className={styles.label}>
          Points to Redeem
        </label>
        <input
          type="number"
          id="points"
          className={styles.input}
          placeholder="Enter points"
          value={redeemPoints}
          onChange={e => setRedeemPoints(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Mode of Redemption</label>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Mode</option>
          <option value="Amazon">Amazon Voucher</option>
          <option value="Flipkart">Flipkart Voucher</option>
          <option value="UPI">UPI Transfer</option>
        </select>
      </div>

      {mode === "UPI" &&
        <div className={styles.formGroup}>
          <label htmlFor="upiId" className={styles.label}>
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            className={styles.input}
            placeholder="Enter your UPI ID"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
          />
        </div>}

      {error &&
        <p className={styles.error}>
          {error}
        </p>}

      <button className={styles.redeemButton} onClick={handleRedeem}>
        Redeem Points
      </button>
    </div>
  );
};

export default Redeem;
