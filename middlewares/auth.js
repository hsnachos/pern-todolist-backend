const jwt = require("jsonwebtoken");

const verify = async (token) => {
  try {
    console.log(`token : ${token}`);
    const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    return {
      ok: true,
      verifyToken,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      error,
    };
  }
};

exports.verify = verify;
