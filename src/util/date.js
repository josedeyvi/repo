function addZero(number) {
  return (number < 10 ? "0" : "") + number;
}
const getDateUTCLocal = (extra='-05:00') => {
  let _date = new Date();
  let n_date = _date.toLocaleString("en-US", { timeZone: "America/Lima" });
  let dateLocal = new Date(n_date);
  return `${dateLocal.getFullYear()}-${addZero(dateLocal.getMonth() + 1)}-${addZero(
      dateLocal.getDate()
  )}T${addZero(dateLocal.getHours())}:${addZero(
      dateLocal.getMinutes()
  )}:${addZero(dateLocal.getSeconds())}${extra}`;
}
const changeDate = (data) =>
    data
        ? `${data.getFullYear()}-${addZero(data.getMonth() + 1)}-${addZero(
        data.getDate()
        )} ${addZero(data.getHours())}:${addZero(
        data.getMinutes()
        )}:${addZero(data.getSeconds())}`
        : "";

const changeDateFormat = (data) =>
  data
    ? `${data.getFullYear()}-${addZero(data.getMonth() + 1)}-${addZero(
        data.getDate()
      )}`
    : "";

const date_add_day = (date, day) => {
  // let hoy = new Date();
  let hoy = date;
  let _day = 1000 * 60 * 60 * 24 * day;
  let new_day = hoy.getTime() + _day;
  let _new_day = new Date(new_day);
  return `${_new_day.getFullYear()}-${addZero(
    _new_day.getMonth() + 1
  )}-${addZero(_new_day.getDate())}`;
};

const fecha_serv_less_5h = () => {
  let hoy = new Date();
  let cino_h = 1000 * 60 * 60 * 5;
  let rest_fecha = hoy.getTime() - cino_h;
  let nueva_fecha = new Date(rest_fecha);
  return `${nueva_fecha.getFullYear()}-${addZero(
    nueva_fecha.getMonth() + 1
  )}-${addZero(nueva_fecha.getDate())} ${addZero(
    nueva_fecha.getHours()
  )}:${addZero(nueva_fecha.getMinutes())}:${nueva_fecha.getSeconds()}`;
};
const getDateNowSys = () => {
  let _date = new Date();
  let n_date = _date.toLocaleString("en-US", { timeZone: "America/Lima" });
  let invdate = new Date(n_date);
  return invdate;
  // return changeDate(invdate);
};
module.exports = {
  changeDate,
  changeDateFormat,
  date_add_day,
  fecha_serv_less_5h,
  getDateNowSys,
  getDateUTCLocal
};
