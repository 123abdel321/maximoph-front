import {
  GET_PROPERTY_PETS_SUCCESSFUL,
  CREATE_PROPERTY_PET,
  CREATE_PROPERTY_PET_SUCCESSFUL,
  CREATE_PROPERTY_PET_FAILED,
  EDIT_PROPERTY_PET,
  EDIT_PROPERTY_PET_SUCCESSFUL,
  EDIT_PROPERTY_PET_FAILED,
  DELETE_PROPERTY_PET,
  DELETE_PROPERTY_PET_SUCCESSFUL,

  UPLOAD_PHOTO_PET,
  UPLOAD_PHOTO_PET_SUCCESSFUL,
  UPLOAD_PHOTO_PET_FAILED,
} from "./actionTypes"

const initialState = {
  editPropertyPetError: null,
  deletePropertyPetError: null,
  createPropertyPetError: null,
  propertyPets: [],
  message: null,
  loading: true,
  loadingGrid: true
}

const propertyPet = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROPERTY_PETS_SUCCESSFUL:
      state = {
        ...state,
        loadingGrid: false,
        createPropertyPetError: null,
        propertyPets: action.payload,
      }
      break
    case CREATE_PROPERTY_PET:
      state = {
        ...state,
        loading: true,
        createPropertyPetError: null,
      }
      break
    case CREATE_PROPERTY_PET_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        createPropertyPetError: null,
      }
      break
    case CREATE_PROPERTY_PET_FAILED:
      state = {
        ...state,
        loading: false,
        createPropertyPetError: action.payload,
      }
      break
    case EDIT_PROPERTY_PET:
        state = {
          ...state,
          loading: true,
          editPropertyPetError: null,
        }
        break
    case EDIT_PROPERTY_PET_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          editPropertyPetError: null,
        }
        break
    case DELETE_PROPERTY_PET:
        state = {
          ...state,
          loading: true,
          deletePropertyPetError: null,
        }
        break
    case DELETE_PROPERTY_PET_SUCCESSFUL:
        state = {
          ...state,
          loading: false,
          deletePropertyPetError: null,
        }
        break
    case UPLOAD_PHOTO_PET:
      state = {
        ...state,
        loading: true,
        uploadPhotoPetError: null,
      }
      break
    case UPLOAD_PHOTO_PET_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        uploadPhotoPetError: null,
      }
      break
    case UPLOAD_PHOTO_PET_FAILED:
      state = {
        ...state,
        loading: false,
        uploadPhotoPetError: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default propertyPet
