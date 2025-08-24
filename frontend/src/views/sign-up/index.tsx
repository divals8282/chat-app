import { useNavigate } from "react-router";
import { signUp } from "../../rest-api/sign-up";
import "./styles.scss";
import { useState } from "react";

export const SignUpView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signUp(userData)
      .then(() => {
        navigate("/sign-in");
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
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            value={userData.nickname}
            onChange={(e) =>
              setUserData({ ...userData, nickname: e.target.value })
            }
            placeholder="Nickname"
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
