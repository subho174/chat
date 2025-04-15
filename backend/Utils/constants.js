// const options = {
//     httpOnly: false,
//     secure: false,
//   };
const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};

module.exports = { options };
