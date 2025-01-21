import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/Success.module.css";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { points, mode, upiId } = location.state || {};

  return <div className={styles.successContainer}>
      <h2>Redemption Successful!</h2>
      <p>
        You have successfully redeemed <strong>{points}</strong> points.
      </p>
      <p>
        Mode: <strong>{mode}</strong>
      </p>
      {mode === "UPI" && <p>
          UPI ID: <strong>{upiId}</strong>
        </p>}
      <button className={styles.backButton} onClick={() => navigate("/")}>
        Back to Dashboard
      </button>
    </div>;
};

export default Success;
