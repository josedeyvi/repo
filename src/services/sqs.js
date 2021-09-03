const Sqs = require("../util/sqs");
const sqsService = {};

sqsService.getOrderSQSVitex = async (cantidad) => {
  try {
    const sqsHookVitex = new Sqs(process.env.URL_SQS_HOOK_VTEX);
    const orders_sqs = await sqsHookVitex.sqsGetMessage(cantidad);

    return {
      statusCode: 200,
      data: orders_sqs,
    };
  } catch (error) {
    console.log("Error SERVICE SQS Vitex", error);
    // console.log("Code:", error.code);
    // console.log("Status:", error.statusCode);
    // console.log("Mesagge:", error.message);
    // throw error;
    return {
      statusCode: error.statusCode, //400, 500
      code: error.code,
      message: error.message,
    };
  }
};

sqsService.deleteOrderSQSVitex = async (receipH_id) => {
  try {
    const sqsHookVitex = new Sqs(process.env.URL_SQS_HOOK_VTEX);
    const orders_sqs = await sqsHookVitex.sqsDeleteMessage_v2(receipH_id);

    return {
      statusCode: 200,
      data: orders_sqs,
      receipH_id,
    };
  } catch (error) {
    console.log("Error SERVICE SQS Vitex Delete", error);
    // console.log("Code:", error.code);
    // console.log("Status:", error.statusCode);
    // console.log("Mesagge:", error.message);
    // throw error;
    return {
      receipH_id,
      statusCode: error.statusCode, //400, 500
      code: error.code,
      message: error.message,
    };
  }
};

module.exports = sqsService;
