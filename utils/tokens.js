import jwt from "jsonwebtoken";

const GenerateTokens = (user) => {
  const payload = {
    name: user.username,
    id: user._id,
  };

  const accessToken = jwt.sign(payload, "simbanic", {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ accessToken }, "simbanic_refresh", {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export default GenerateTokens;
