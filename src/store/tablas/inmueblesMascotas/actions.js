import {
  UPLOAD_PHOTO_PET,
  UPLOAD_PHOTO_PET_FAILED,
  UPLOAD_PHOTO_PET_SUCCESSFUL,
  GET_PROPERTY_PETS,
  GET_PROPERTY_PETS_SUCCESSFUL,
  CREATE_PROPERTY_PET,
  CREATE_PROPERTY_PET_SUCCESSFUL,
  CREATE_PROPERTY_PET_FAILED,
  EDIT_PROPERTY_PET,
  EDIT_PROPERTY_PET_SUCCESSFUL,
  EDIT_PROPERTY_PET_FAILED,
  DELETE_PROPERTY_PET,
  DELETE_PROPERTY_PET_SUCCESSFUL,
  DELETE_PROPERTY_PET_FAILED,
} from "./actionTypes"

export const getPropertyPets = (withButtons, cb, editInmuebleId) => ({
  type: GET_PROPERTY_PETS,
  payload: {withButtons, cb, editInmuebleId}
})

export const getPropertyPetsSuccessful = propertyPets => ({
  type: GET_PROPERTY_PETS_SUCCESSFUL,
  payload: propertyPets,
})

export const createPropertyPet = (propertyPet, cb) => {
  return {
    type: CREATE_PROPERTY_PET,
    payload: { propertyPet, cb }
  }
}

export const createPropertyPetSuccessful = propertyPet => {
  return {
    type: CREATE_PROPERTY_PET_SUCCESSFUL,
    payload: propertyPet,
  }
}

export const createPropertyPetFailed = propertyPet => {
  return {
    type: CREATE_PROPERTY_PET_FAILED,
    payload: propertyPet,
  }
}

export const editPropertyPet = (propertyPet, cb) => {
  return {
    type: EDIT_PROPERTY_PET,
    payload: { propertyPet, cb }
  }
}

export const editPropertyPetSuccessful = propertyPet => {
  return {
    type: EDIT_PROPERTY_PET_SUCCESSFUL,
    payload: propertyPet,
  }
}

export const editPropertyPetFailed = propertyPet => {
  return {
    type: EDIT_PROPERTY_PET_FAILED,
    payload: propertyPet,
  }
}

export const deletePropertyPet = (propertyPet, cb) => {
  return {
    type: DELETE_PROPERTY_PET,
    payload: { propertyPet, cb }
  }
}

export const deletePropertyPetSuccessful = propertyPet => {
  return {
    type: DELETE_PROPERTY_PET_SUCCESSFUL,
    payload: propertyPet,
  }
}

export const deletePropertyPetFailed = propertyPet => {
  return {
    type: DELETE_PROPERTY_PET_FAILED,
    payload: propertyPet,
  }
}

export const uploadPhotoPet = (photoPet, cb) => {
  return {
    type: UPLOAD_PHOTO_PET,
    payload: { photoPet, cb }
  }
}

export const uploadPhotoPetSuccessful = photoPet => {
  return {
    type: UPLOAD_PHOTO_PET_SUCCESSFUL,
    payload: photoPet,
  }
}

export const uploadPhotoPetFailed = photoPet => {
  return {
    type: UPLOAD_PHOTO_PET_FAILED,
    payload: photoPet,
  }
}
