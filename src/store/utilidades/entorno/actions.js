import {
  GET_LOGS_MAXIMO,
  GET_DATA_SUMMARY_ERP,
  GET_TABLE_IMPORTER_TEMPLATE,
  POST_TABLE_IMPORTER_TEMPLATE,
  GET_DATA_SUMMARY_ERP_SUCCESSFUL,
  EDIT_API_KEY_ERP,
  SYNC_DATA_ERP,
  EDIT_API_KEY_ERP_SUCCESSFUL,
  EDIT_API_KEY_ERP_FAILED,
  EDIT_ENVIROMENT_MAXIMO,
  EDIT_ENVIROMENT_MAXIMO_SUCCESSFUL,
  EDIT_ENVIROMENT_MAXIMO_FAILED,
  REMOVE_NOTIFICATION
} from "./actionTypes"

export const getLogs = (withButtons, cb) => ({
  type: GET_LOGS_MAXIMO,
  payload: {withButtons, cb}
})

export const getDataSummaryErp = (withButtons, cb) => ({
  type: GET_DATA_SUMMARY_ERP,
  payload: {withButtons, cb}
})

export const downloadTableImporterTemplate = (origin, cb) => ({
  type: GET_TABLE_IMPORTER_TEMPLATE,
  payload: {origin, cb}
})

export const uploadTableImporterTemplate = (template, cb) => ({
  type: POST_TABLE_IMPORTER_TEMPLATE,
  payload: {template, cb}
})

export const getDataSummaryErpSuccessful = summaryErp => ({
  type: GET_DATA_SUMMARY_ERP_SUCCESSFUL,
  payload: summaryErp,
})

export const editApiKeyErp = (apiKey, cb) => {
  return {
    type: EDIT_API_KEY_ERP,
    payload: { apiKey, cb }
  }
}

export const syncDataERP = (data, cb) => {
  return {
    type: SYNC_DATA_ERP,
    payload: { data, cb }
  }
}

export const editApiKeyErpSuccessful = apiKey => {
  return {
    type: EDIT_API_KEY_ERP_SUCCESSFUL,
    payload: apiKey,
  }
}

export const editApiKeyErpFailed = apiKey => {
  return {
    type: EDIT_API_KEY_ERP_FAILED,
    payload: apiKey,
  }
}

export const editEnviromentMaximo = (enviromentValues, cb) => {
  return {
    type: EDIT_ENVIROMENT_MAXIMO,
    payload: { enviromentValues, cb }
  }
}

export const editEnviromentMaximoSuccessful = enviromentValues => {
  return {
    type: EDIT_ENVIROMENT_MAXIMO_SUCCESSFUL,
    payload: enviromentValues,
  }
}

export const editEnviromentMaximoFailed = enviromentValues => {
  return {
    type: EDIT_ENVIROMENT_MAXIMO_FAILED,
    payload: enviromentValues,
  }
}

export const removeNotification = notificationId => {
  return {
    type: REMOVE_NOTIFICATION,
    payload: {notificationId},
  }
}