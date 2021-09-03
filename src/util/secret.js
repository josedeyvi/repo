const jsonfile = require("jsonfile");
const file = "./envMDW.json";
const mwtSecret = {};

mwtSecret.setVariables = () => {
  const obj = jsonfile.readFileSync(file);
  const body = JSON.parse(obj);
  console.log('credencial',body)

  process.env.URL_SQS_HOOK_VTEX = body.credentials.URL_SQS_HOOK_VTEX;

  process.env.VTEX_URL = body.credentials.VTEX_URL;
  process.env.VTEX_API_KEY = body.credentials.VTEX_API_KEY;
  process.env.VTEX_API_SECRET = body.credentials.VTEX_API_SECRET;
  process.env.VTEX_CLIENT = body.credentials.VTEX_CLIENT;


  // process.env.JANIS_URL = body.credentials.JANIS_URL;
  // process.env.JANIS_LOGISTIC_URL = body.credentials.JANIS_LOGISTIC_URL;
  // process.env.JANIS_API_KEY = body.credentials.JANIS_API_KEY;
  // process.env.JANIS_API_SECRET = body.credentials.JANIS_API_SECRET;
  // process.env.JANIS_CLIENT = body.credentials.JANIS_CLIENT;

  process.env.JANIS_LOGISTIC_URL = body.credentials.JANIS_LOGISTIC_URL;
  process.env.JANIS_LOGISTIC_LOGISTIC_URL = body.credentials.JANIS_LOGISTIC_LOGISTIC_URL;
  process.env.JANIS_LOGISTIC_API_KEY = body.credentials.JANIS_LOGISTIC_API_KEY;
  process.env.JANIS_LOGISTIC_API_SECRET = body.credentials.JANIS_LOGISTIC_API_SECRET;
  process.env.JANIS_LOGISTIC_CLIENT = body.credentials.JANIS_LOGISTIC_CLIENT;


  process.env.DB_USER = body.credentials.DB_USER;
  process.env.DB_HOST = body.credentials.DB_HOST;
  process.env.DB_NAME = body.credentials.DB_NAME;
  process.env.DB_PASSWORD = body.credentials.DB_PASSWORD;
  process.env.DB_PORT = body.credentials.DB_PORT;

  process.env.URL_MDW_PROCESS = body.credentials.URL_MDW_PROCESS || 'https://api.test.smdigital.pe/qa/v1/pe/tracking/service-provider';
  process.env.ZUBALE_KEY = body.credentials.ZUBALE_KEY || '8S2L9KatRmmtPOyVyumAWdx5Og0JXT44';
};

module.exports = mwtSecret;
