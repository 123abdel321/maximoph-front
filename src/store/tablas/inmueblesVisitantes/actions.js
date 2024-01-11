import {
  GET_PROPERTY_VISITORS,
  GET_PROPERTY_VISITORS_SUCCESSFUL,
  CREATE_PROPERTY_VISITOR,
  CREATE_PROPERTY_VISITOR_SUCCESSFUL,
  CREATE_PROPERTY_VISITOR_FAILED,
  EDIT_PROPERTY_VISITOR,
  EDIT_PROPERTY_VISITOR_SUCCESSFUL,
  EDIT_PROPERTY_VISITOR_FAILED,
  DELETE_PROPERTY_VISITOR,
  DELETE_PROPERTY_VISITOR_SUCCESSFUL,
  DELETE_PROPERTY_VISITOR_FAILED,
} from "./actionTypes"

export const getPropertyVisitors = (withButtons, cb, editInmuebleId) => ({
  type: GET_PROPERTY_VISITORS,
  payload: {withButtons, cb, editInmuebleId}
})

export const getPropertyVisitorsSuccessful = propertyVisitors => ({
  type: GET_PROPERTY_VISITORS_SUCCESSFUL,
  payload: propertyVisitors,
})

export const createPropertyVisitor = (propertyVisitor, cb) => {
  return {
    type: CREATE_PROPERTY_VISITOR,
    payload: { propertyVisitor, cb }
  }
}

export const createPropertyVisitorSuccessful = propertyVisitor => {
  return {
    type: CREATE_PROPERTY_VISITOR_SUCCESSFUL,
    payload: propertyVisitor,
  }
}

export const createPropertyVisitorFailed = propertyVisitor => {
  return {
    type: CREATE_PROPERTY_VISITOR_FAILED,
    payload: propertyVisitor,
  }
}

export const editPropertyVisitor = (propertyVisitor, cb) => {
  return {
    type: EDIT_PROPERTY_VISITOR,
    payload: { propertyVisitor, cb }
  }
}

export const editPropertyVisitorSuccessful = propertyVisitor => {
  return {
    type: EDIT_PROPERTY_VISITOR_SUCCESSFUL,
    payload: propertyVisitor,
  }
}

export const editPropertyVisitorFailed = propertyVisitor => {
  return {
    type: EDIT_PROPERTY_VISITOR_FAILED,
    payload: propertyVisitor,
  }
}

export const deletePropertyVisitor = (propertyVisitor, cb) => {
  return {
    type: DELETE_PROPERTY_VISITOR,
    payload: { propertyVisitor, cb }
  }
}

export const deletePropertyVisitorSuccessful = propertyVisitor => {
  return {
    type: DELETE_PROPERTY_VISITOR_SUCCESSFUL,
    payload: propertyVisitor,
  }
}

export const deletePropertyVisitorFailed = propertyVisitor => {
  return {
    type: DELETE_PROPERTY_VISITOR_FAILED,
    payload: propertyVisitor,
  }
}
