const Db = require("../util/pg");
const sql = require("sql");


const {fecha_serv_less_5h, changeDate, getDateNowSys} = require("../util/date");
const modelTracking = {};

modelTracking.getOrderTrackingStatusPreRouter = async (filtro) => {
  // agregar un dia mas a la fecha fin
  // para tomar todo ese dia (deliver_date_start between '2021-02-14' and '2021-02-15 23:59:59')
  // status_id = 40 // Listo para enviar
  try {
    const {limit = 10, id_status_table} = filtro;
    let statusTable = id_status_table.join("','");
    console.log("------ MODEL Tracking get Janis--------", process.env.DB_HOST);
    const db = new Db("tracking");
    const sqlText = `
    SELECT
    t1.id_order_tracking,
    t1.id_status_table,
    t1.id_tracking,
    t1.id_tracking_final,
    t1.order_id,
    t2.id_order_janis,
    t2.id_janis,
    t2."seqId",
    t3.id_route_assignment,
    t3.id_transport,
    t3.id_tracking,
    t3.route_janis_id,
    t4.code_driver,
    t4.cod_repartidor,
    t4.cod_vehiculo_janis,
    t4.cod_empresa_janis,
     t5.route_id as id_route_proveedor
  FROM  order_tracking as t1
inner join order_janis as t2
  on t1.order_id = t2.order_id and t2.status_id=10
inner join route_assignment as t3
  on t1.id_tracking_final = t3.id_tracking
inner join transport as t4
  on t3.id_transport = t4.id_transport
inner join tracking_ids as t5
  on t1.id_tracking_final = t5.id_tracking
    WHERE 1=1
    AND t1.id_status_table  IN ('${statusTable}')
    LIMIT $1;`;

    return await db.query(sqlText, [limit]);
  } catch (error) {
    console.log("--------------------error MODEL get Order Janis lito envio");
    console.log(error);
    return {
      statusCode: 500,
      message: "error en la BD",
    };
  }
};


//

modelTracking.updateOrderTrackingStatusRouter = async (item) => {

  const ASIGNADO_ENV_JANIS = 13;
  const DATE_CURRENT = changeDate(getDateNowSys());
  try {
    const db = new Db("tracking");

    const _routeAssignment = `
    UPDATE route_assignment SET
    route_janis_id = $1,
      update_date = $2
    WHERE
      id_route_assignment =$3
    `;

    const _track = `
    UPDATE order_tracking SET
      id_status_table = $1,
      update_date = $2
    WHERE
      id_order_tracking =$3
    `;

    // const _delivery_detail = `
    // UPDATE delivery_detail SET
    //   id_status_table = $1,
    //   update_date = $2
    // WHERE
    //   id_delivery_detail IN ('${ids_delivery_detail.join("','")}')
    // `;

    let _params_1 = [item.routeId, DATE_CURRENT, item.id_route_assignment];
    let _params_2 = [ASIGNADO_ENV_JANIS, DATE_CURRENT, item.id_order_tracking];
    // let _detail= [EN_RUTA, changeDate(getDateNowSys())];


    const queryRouteAssignment = {
      text: _routeAssignment,
      values: _params_1,
    };

    const queryTrack = {
      text: _track,
      values: _params_2,
    };


    // const queryDetail = {
    //   text: _delivery_detail,
    //   values: _detail,
    // };

    // var list = [ queryTrack,queryDetail];
    var list = [queryRouteAssignment, queryTrack];


    for (const order of item.orders) {

      let queryDetail = {
        text: `INSERT INTO route_assignment_detail
(route_janis_id, route_order_id, order_id,  creation_date)
VALUES ($1,$2,$3,$4)
`,
        values: [order.routeId, order.id, order.orderEcommerceId, DATE_CURRENT],
      }

      list.push(queryDetail)

    }


    return await db.queryTransaction(list);

    // Fin de proceso
  } catch (error) {
    console.log("--------------------error MODEL savePedido");
    console.log(error);
    return {
      statusCode: 500,
      message: "error en la BD",
    };
  }
};


modelTracking.getTrackingAssigmentRoute = async (
  {
    provider_code = 'ZUBALE',
    orders_id = [],
  }
) => {
  const db = new Db("tracking");


  const sqlText = `
    select
      *
    from
      order_provider op
    where
      op.picking_status = 'TEMP_ASSIGNMENT_ROUTE'

      and op.provider_code = $1
      and op.order_id in $2
  `;

  


  try {

    const result_query = await db.query(sqlText, [provider_code, orders_id,]);

    if (result_query.rowCount > 0) {
      return result_query.rows;

    }else{
      return [];
    }
  } catch (err) {
    console.log("ERROR EN LA DB")
    console.error(err);
    return err;
  }


}


modelTracking.updateTrackingAssigmentRoute = async (
  {
    orders_id = [],
  }
) => {


  const sqlText = `
  update
	order_provider
set
	picking_status = 'ASSIGNMENT_ROUTE'
where
	order_id in $1
  returning order_id  
`;

  try{

    const result_query = await db.query(sqlText, [orders_id]);
    return result_query.rows;
  }catch(err){
    console.log("ERROR EN LA DB")
    console.error(err);
    return err;
  }





}

module.exports = modelTracking;
