const servJanis = {};
const axios = require("axios");

getConfig = () => {

    // const _url = process.env.JANIS_URL;
    const _url = process.env.JANIS_LOGISTIC_URL;
    const _api_key = process.env.JANIS_LOGISTIC_API_KEY;
    const _secret = process.env.JANIS_LOGISTIC_API_SECRET;
    const _client = process.env.JANIS_LOGISTIC_CLIENT;

    const config = {
        headers: {
            "Content-Type": "application/json",
            "janis-api-key": _api_key,
            "janis-api-secret": _secret,
            "Janis-Client": _client,
        },
    };

    return {_url, config};
};


servJanis.setOrderCreateRouter = async (item) => {

    let postData = {
        refId: item.id_route_proveedor,// ojo esto esta  pendiente ya que  tien  que  jalar de una  entidad o tabla
        vehicleId: item.cod_vehiculo_janis,
        initialCash: 0,
        orders: [
            {
                orderId: item.id_janis
            }
        ],
        deliveryAssistantsEmployeeIds: [
            item.cod_repartidor
        ],
        driversEmployeeIds: [
            item.code_driver
        ],
        logisticCompanyId: item.cod_empresa_janis
    };

    //la  condicion es q  estea en  estado  despachado

    let dataStorage = {
        "id_order_tracking": item.id_order_tracking,
        "id_order_janis": item.id_order_janis,
        "id_route_assignment": item.id_route_assignment,
        "orderId": item.id_janis,
        "order_id": item.order_id,
        "routeId": ''
    };
    try {

        const {_url, config} = getConfig();
        console.log("Consultando a Janis...");

        //const resp = await axios.patch(`${_url}routes/228`, postData, config);
        const resp = await axios.post(`${_url}routes`, postData, config);
        //const resp = await axios.get(`https://janisqa.in/api/order/get/`, config);
        dataStorage.routeId=resp.data.id
        let resp2 = await getOrderRouter(resp.data.id);
        dataStorage.orders=resp2.data.orders

        return {
            dataStorage,
            statusCode: resp.status,
            data: resp.data,
            order_id : item.order_id
        };

    } catch (error) {
        console.log("Error in Service Janis -----");

        return {
            dataStorage,
            statusCode: error.response.status,
            message: error.response.data,
        };
    }
};





getOrderRouter = async (routeId) => {

    try {
        const {_url, config} = getConfig();
        //const resp = await axios.patch(`${_url}routes/224`, postData, config);
        //const resp = await axios.post(`${_url}routes`, postData, config);
        const resp = await axios.get(`${_url}routes/${routeId}`, config);
        //const resp = await axios.get(`https://janisqa.in/api/order/get/`, config);
        return {
            statusCode: resp.status,
            data: resp.data,
        };

    } catch (error) {
        throw error;
        // console.log("Error in Service Janis -----");
        //
        // return {
        //     statusCode: error.response.status,
        //     message: error.response.data,
        // };
    }
};


module.exports = servJanis;
