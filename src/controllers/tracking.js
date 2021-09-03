const mdwtrac = require("../models/tracking");
const {changeDateFormat, date_add_day, getDateUTCLocal} = require("../util/date");
const servJanis = require("../services/janis");
const zubale_req = require("../util/zubale_requester") ; 

const mdwTrackingCtl = {};

getDateRange = () => {
  let now = new Date();
  let date_ini = changeDateFormat(now);
  let date_end = date_add_day(now, 1);
  return {date_ini, date_end};
};

getids = (ids_janis, ids_tracking) => {
  let id_j_n = [];
  let id_t_n = [];

  for (const j of ids_tracking) {
    id_t_n.push(j.order_id);
  }

  for (const i of ids_janis) {
    console.log(i.order_id);
    if (id_t_n.includes(i.order_id)) {
      id_j_n.push(parseInt(i.id_order_janis));
    }
  }

  return {id_j_n, id_t_n};
};

mdwTrackingCtl.sendOrderCreateRouter = async (limit) => {
  try {
    let dataJanis = [];
    let dataJanis2 = [];
    let reg_update_ok_level_1 = [];
    let reg_update_error_level_1 = [];

    let reg_update_ok_level_2 = [];
    let reg_update_error_level_2 = [];

    let msg = '', msgError = '', is_update_db = false;

    //buscamos  los  registros con estado  asignado
    const ASIGNADO = 12;


    // seleccionamos lo 10 primero registros de BD Janis
    // const { date_ini, date_end } = getDateRange();
    // console.log(date_ini, date_end);
    const orders_janis = await mdwtrac.getOrderTrackingStatusPreRouter({
      limit: limit,
      id_status_table: [ASIGNADO]
    });

    console.log(orders_janis.rows)
    console.table(orders_janis.rows);
    //! :: Proceso modelo Food
    
    // Consultamos las ordenes si cuentan con IdTracking inicial en la tabla de Tracking
    if (orders_janis.rows.length > 0) {

      orders_janis.rows.map((item) => {

        console.log(item)
        dataJanis.push(servJanis.setOrderCreateRouter(item));
      });//! aca envio a janis

      let respuesta = await Promise.all(dataJanis);

      // verificamos estado 200 para  llebar registros a  actualizar
      if (respuesta.length > 0) {
        let i = 0
        for (const order of respuesta) {
          if (parseInt(order.statusCode) === 200) {
            i = i + 1;
            
            reg_update_ok_level_1.push(order.dataStorage);
          } else {
            reg_update_error_level_1.push({ "dataStorage": order.dataStorage, "msg": order.message });
          }
        }

        if (respuesta.length != i) {
          msg = 'No se  actualizaron todos los registros en Janis'
          msgError = msg;
        } else {
          msg = 'Level 1: terminado Satisfactoriamente'
        }

      }

      if (reg_update_ok_level_1.length > 0) {

        reg_update_ok_level_1.map(async item => {

          try {
            // let {statusCode,data,message}=  await servJanis.getOrderRouter(item);
            //
            // if (statusCode===200){
            //     item.orders=data.orders
            // }else{
            //     console.log(message)
            //     console.log("Fallo al  obtener La ruta  creada")
            //
            // }
            // let reg_update_new_state = await mdwtrac.updateOrderTrackingStatusRouter(item);
            reg_update_ok_level_2.push(await mdwtrac.updateOrderTrackingStatusRouter(item))
            msg += ', Se actualizo el estado en la db';
          } catch (e) {
            msg += ', Ocurrio un error al actualizar estado en DB'
            msgError += msg;
            reg_update_error_level_2.push(e)
          }

          
        });
        

        //! agregar aqui

        if (reg_update_error_level_1.length >0 ){

          const orders_id = reg_update_ok_level_1.map((item) => { return item.order_id });

          const orders_asignment=await mdwtrac.getTrackingAssigmentRoute({
            orders_id : orders_id,
            provider_code :'ZUBALE'
          }) ; 

          const to_update_orders_id = orders_asignment.map((item) => { return item.order_id });

          if (to_update_orders.length >0  ){
            const update_rows = await mdwtrac.updateTrackingAssigmentRoute({ orders_id: to_update_orders_id });

            console.log("ACTUALIZADO");
            console.log(update_rows);
          }

          console.log("SE TERMINO ENROUTE TO DROPOFF")
        }
        

        //!

      }


      //------------------ver  rutas  creadas
      console.log('reg_update_ok_level_1', reg_update_ok_level_1)
      console.log('reg_update_error_level_1', reg_update_error_level_1)

      // //------------------ver  rutas  iniciadas
      // console.log('reg_update_ok_level_2', reg_update_ok_level_2)
      // console.log('reg_update_error_level_2', reg_update_error_level_2)

      let resp_final = {
        statusCode: msgError.length > 0 ? 500 : 200,
        routerCreate: reg_update_ok_level_1.length,
        // routerStart: reg_update_ok_level_2.length,
        message: msg,
      };
      console.log(resp_final)
      return resp_final;
    }

    msg = 'No hay registros para  actualizar';
    return {
      statusCode: 200,
      // data: orders_sqs,
      message: msg,
    };
  } catch (error) {
    console.log(error);
    throw error;

  }
};

module.exports = mdwTrackingCtl;
