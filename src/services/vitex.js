const servVtex = {};
const axios = require("axios");
const url = require("url");

getConfig = () => {
  const _url = process.env.VTEX_URL;
  const _api_key = process.env.VTEX_API_KEY;
  const _secret = process.env.VTEX_API_SECRET;
  const _client = process.env.VTEX_CLIENT;

  const config = {
    headers: {
      "Content-Type": "application/json",
      "janis-api-key": _api_key,
      "janis-api-secret": _secret,
      "Janis-Client": _client,
    },
  };

  return { _url, config };
};

servVtex.getOrderVtexXId = async (_id) => {
  try {
    const data = { id: _id };
    const params = new url.URLSearchParams(data);
    const { _url, config } = getConfig();

    console.log("Consultando a Vtex...");
    const resp = await axios.get(`${_url}order/get/?${params}`, config);
    // console.log(`${_url}order/get/?${params}`, "------", config);

    return {
      id: _id,
      statusCode: resp.status,
      data: resp.data,
    };
  } catch (error) {
    console.log("Error in Service Vtex -----");
    // console.log("Error in Service Vtex -----", error);
    // console.log(error.response.status); //400, 401(Invalid Cliente), 503
    // console.log(error.response.data);
    return {
      id: _id,
      statusCode: error.response.status,
      message: error.response.data,
    };
  }
};

module.exports = servVtex;
