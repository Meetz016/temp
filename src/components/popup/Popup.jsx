import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/Popup.module.css";

const Popup = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data on component mount
    chrome.storage.sync.get(["userData"], async (result) => {
      if (result.userData) {
        const token = await getAuthToken(false);
        if (token) {
          setCurrentUser({ ...result.userData, token });
          const userPoints = await fetchUserPoints(token, result.userData.email);
          setPoints(userPoints || 0);
        } else {
          clearLocalUserData();
        }
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken(true);
      if (!token) {
        alert("Failed to obtain OAuth token.");
        return;
      }

      const userInfo = await fetchUserInfo(token);
      if (userInfo) {
        const userPoints = await fetchUserPoints(token, userInfo.email);
        const userData = {
          token,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        };
        chrome.storage.sync.set({ userData });
        setCurrentUser(userData);
        setPoints(userPoints || 0);
      } else {
        alert("Failed to retrieve user information.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (currentUser?.token) {
      await removeCachedAuthToken(currentUser.token);
    }
    clearLocalUserData();
  };

  const clearLocalUserData = () => {
    chrome.storage.sync.remove(["userData"], () => setCurrentUser(null));
  };

  const getAuthToken = (interactive) => {
    return new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive }, (token) => {
        if (chrome.runtime.lastError) {
          console.error("getAuthToken error:", chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(token);
        }
      });
    });
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const fetchUserPoints = async (token, email) => {
    // TODO: Placeholder for backend points API call
    return 10;
  };

  const removeCachedAuthToken = (token) => {
    return new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, resolve);
    });
  };

  return (
<div className={styles.container}>
  <h1 className={styles.title}>My Cashback</h1>

  {loading ? (
    <div className={styles.loading}>
      <LoadingSpinner />
      <p>Loading points...</p>
    </div>
  ) : currentUser ? (
    <div id="info-container" className={styles.infoContainer}>
      <div id="user-info-container" className={styles.userInfoContainer}>
        {currentUser.picture && (
          <img
            src={currentUser.picture}
            alt="User"
            className={styles.userPicture}
          />
        )}
        <div id="user-info" className={styles.userInfo}>
          <p className={styles.userName}>{currentUser.name}</p>
          <p className={styles.userEmail}>{currentUser.email}</p>
        </div>
      </div>
      <div className={styles.pointsContainer}>
        <div id="points" className={styles.points}>
          {points}
        </div>
        <div className={styles.pointsLabel}>Reward Points</div>
      </div>
      <button
        id="redeem-button"
        className={styles.redeemButton}
        onClick={() => navigate("/redeem")}
      >
        Redeem Points
      </button>
      <div
        className={styles.signOutIcon}
        onClick={handleSignOut}
        title="Sign Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="#555" d="M16 13v-2H7V8l-5 4 5 4v-3z" />
          <path
            fill="#555"
            d="M20 3H4c-1.1 0-2 .9-2 2v4h2V5h16v14H4v-4H2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          />
        </svg>
      </div>
    </div>
  ) : (
    <div className={styles.authSection}>
      <button
        id="sign-in-btn"
        className={`${styles.button} ${styles.signIn}`}
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  )}
</div>

  );
};

const LoadingSpinner = () => (
  <div className="spinner" />
);

export default Popup;
