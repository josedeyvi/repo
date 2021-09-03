const axios = require("axios");
const trackinModel = require("../models/tracking");

const send_request = async ({
    method = 'post',
    url = '',
    payload = {},
    headers = { 'Content-Type': 'application/json' },
    query = {},
    timeout = 60000
}) => {

    let default_headers = {
        'Content-Type': 'application/json',
        ...headers
    }
    const config = {
        method: method,
        url: url,
        headers: default_headers,
        data: payload,
        timeout: timeout,
        params: query
    }
    try {
        let resp = await axios(config);

        return resp;
    }
    catch (err) {
        console.log(err)
        throw err
    }

}



const notify_status_change = async ({

    newStatus,//: "READY_FOR_DELIVERY",
    oldStatus,//: "AT_CASHIER",
    orderID,//: "v535073wofq-01",
    trackingUrl,//: "https://tracking.zubale.com/?token=kmlsvpkmedvomprs"
    timeout = 60000,
}) => {

    const url_mdw = `${process.env.URL_MDW_PROCESS}/zubale/integration/notifyStatusChange`;
    const api_key = process.env.ZUBALE_KEY;
    const provider_code = "ZUBALE";

    const payload = {
        "provider_code": provider_code,
        "newStatus": newStatus,
        "oldStatus": oldStatus,
        "orderID": orderID,
        "trackingUrl": trackingUrl
    }

    const headers = {
        "x-api-key": api_key,
    }


    const response = await send_request({
        url:url_mdw,
        timeout: timeout,
        payload: payload,
        headers: headers

    });

    return response
}

const send_enroute_to_dropoff = async ({orders_id = []})=>{

    const provider_orders = await trackinModel.getTrackingOrdersOnRoute({
        provider_code: 'ZUBALE',
        orders_id: orders_id
    });
    let to_execute = [];

    for (const item in provider_orders) {
        const { order_id , url_tracking } = item;

        const notification = notify_status_change({
            newStatus: 'ENROUTE_TO_DROPOFF',
            oldStatus: 'READY_FOR_DELIVERY',
            orderID: order_id,
            trackingUrl: url_tracking,
        });
        to_execute.push(notification);
    }
    try {
        const result = await Promise.all(to_execute);
        return result;
    }catch(err){

        
        console.log(err) ;
        return err ; 

    }
}

module.exports = {
    send_enroute_to_dropoff
}