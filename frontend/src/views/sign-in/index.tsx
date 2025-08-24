import { useNavigate } from "react-router";
import { signIn } from "../../rest-api/sign-in";
import "./styles.scss";
import { useState } from "react";

export const SignInView = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signIn(userData)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => {
        console.info(err.response.data);
      });
  };

  return (
    <div className="sign-in-view">
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            placeholder="Email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            placeholder="Password"
          />
        </div>
        <button onClick={() => navigate("/sign-up")}>Go To Sign Up</button>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};
