import {
  GET_ZONES,
  GET_ZONES_SUCCESSFUL,
  CREATE_ZONE,
  CREATE_ZONE_SUCCESSFUL,
  CREATE_ZONE_FAILED,
  EDIT_ZONE,
  EDIT_ZONE_SUCCESSFUL,
  EDIT_ZONE_FAILED,
  DELETE_ZONE,
  DELETE_ZONE_SUCCESSFUL,
  DELETE_ZONE_FAILED,
} from "./actionTypes"

export const getZones = (withButtons, cb) => ({
  type: GET_ZONES,
  payload: {withButtons, cb}
})

export const getZonesSuccessful = zones => ({
  type: GET_ZONES_SUCCESSFUL,
  payload: zones,
})

export const createZone = (zone, cb) => {
  return {
    type: CREATE_ZONE,
    payload: { zone, cb }
  }
}

export const createZoneSuccessful = zone => {
  return {
    type: CREATE_ZONE_SUCCESSFUL,
    payload: zone,
  }
}

export const createZoneFailed = zone => {
  return {
    type: CREATE_ZONE_FAILED,
    payload: zone,
  }
}

export const editZone = (zone, cb) => {
  return {
    type: EDIT_ZONE,
    payload: { zone, cb }
  }
}

export const editZoneSuccessful = zone => {
  return {
    type: EDIT_ZONE_SUCCESSFUL,
    payload: zone,
  }
}

export const editZoneFailed = zone => {
  return {
    type: EDIT_ZONE_FAILED,
    payload: zone,
  }
}

export const deleteZone = (zone, cb) => {
  return {
    type: DELETE_ZONE,
    payload: { zone, cb }
  }
}

export const deleteZoneSuccessful = zone => {
  return {
    type: DELETE_ZONE_SUCCESSFUL,
    payload: zone,
  }
}

export const deleteZoneFailed = zone => {
  return {
    type: DELETE_ZONE_FAILED,
    payload: zone,
  }
}
