import {
  GET_PROPERTY_OWNERS_RENTERS_SUCCESSFUL,
  CREATE_PROPERTY_OWNER_RENTER,
  CREATE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
  CREATE_PROPERTY_OWNER_RENTER_FAILED,
  EDIT_PROPERTY_OWNER_RENTER,
  EDIT_PROPERTY_OWNER_RENTER_SUCCESSFUL,
  EDIT_PROPERTY_OWNER_RENTER_FAILED,
  DELETE_PROPERTY_OWNER_RENTER,
  DELETE_PROPERTY_OWNER_RENTER_SUCCESSFUL,
} from "./actionTypes"

const initialState = {
  editPropertyOwnerRenterError: null,
  deletePropertyOwnerRenterError: null,
  createPropertyOwnerRenterError: null,
  propertyOwnersRenters: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const propertyOwnerRenter = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_OWNERS_RENTERS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPropertyOwnerRenterError: null,
        propertyOwnersRenters: action.payload,
      }
      break
    case CREATE_PROPERTY_OWNER_RENTER:
      state = {
        ...state,
        loading: true,
        createPropertyOwnerRenterError: null,
      }
      break
    case CREATE_PROPERTY_OWNER_RENTER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPropertyOwnerRenterError: null,
      }
      break
    case CREATE_PROPERTY_OWNER_RENTER_FAILED:
      state = {
        ...state,
        loading: false,
        createPropertyOwnerRenterError: action.payload,
      }
      break  
    case EDIT_PROPERTY_OWNER_RENTER:
        state = {
          ...state,
          loading: true,
          editPropertyOwnerRenterError: null,
        }
        break
    case EDIT_PROPERTY_OWNER_RENTER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPropertyOwnerRenterError: null,
        }
        break
    case DELETE_PROPERTY_OWNER_RENTER:
        state = {
          ...state,
          loading: true,
          deletePropertyOwnerRenterError: null,
        }
        break
    case DELETE_PROPERTY_OWNER_RENTER_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePropertyOwnerRenterError: null,
        }
        break
    default:
      state = { ...state }
      break
  }
  return state
}

export default propertyOwnerRenter
