import {
  GET_PROPERTY_VISITORS_SUCCESSFUL,
  CREATE_PROPERTY_VISITOR,
  CREATE_PROPERTY_VISITOR_SUCCESSFUL,
  CREATE_PROPERTY_VISITOR_FAILED,
  EDIT_PROPERTY_VISITOR,
  EDIT_PROPERTY_VISITOR_SUCCESSFUL,
  EDIT_PROPERTY_VISITOR_FAILED,
  DELETE_PROPERTY_VISITOR,
  DELETE_PROPERTY_VISITOR_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editPropertyVisitorError: null,
  deletePropertyVisitorError: null,
  createPropertyVisitorError: null,
  propertyVisitors: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const propertyVisitor = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_VISITORS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPropertyVisitorError: null,
        propertyVisitors: action.payload,
      }
      break
    case CREATE_PROPERTY_VISITOR:
      state = {
        ...state,
        loading: true,
        createPropertyVisitorError: null,
      }
      break
    case CREATE_PROPERTY_VISITOR_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPropertyVisitorError: null,
      }
      break
    case CREATE_PROPERTY_VISITOR_FAILED:
      state = {
        ...state,
        loading: false,
        createPropertyVisitorError: action.payload,
      }
      break
    case EDIT_PROPERTY_VISITOR:
        state = {
          ...state,
          loading: true,
          editPropertyVisitorError: null,
        }
        break
    case EDIT_PROPERTY_VISITOR_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPropertyVisitorError: null,
        }
        break
    case DELETE_PROPERTY_VISITOR:
        state = {
          ...state,
          loading: true,
          deletePropertyVisitorError: null,
        }
        break
    case DELETE_PROPERTY_VISITOR_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePropertyVisitorError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default propertyVisitor
