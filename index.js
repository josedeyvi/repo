const ctl = require("./src/controllers/tracking");
const secret = require("./src/util/secret");

exports.handler = async (event, context, callback) => {
  try {
    // Inicio del proyecto
    secret.setVariables();
    const res = await ctl.sendOrderCreateRouter(10);
    console.log('res:',res)


    // const response = {
    //   statusCode: 200,
    //   message: JSON.stringify("Registro Exitoso!"),
    // };
    return res;
  } catch (e) {
    console.log("Error", e);
    console.log(`Application ERROR: ${e}`);
    throw e;
  }
};
