import {
  GET_PERSONS,
  GET_PERSONS_SUCCESSFUL,
  CREATE_PERSON,
  CREATE_PERSON_SUCCESSFUL,
  CREATE_PERSON_FAILED,
  EDIT_PERSON,
  EDIT_PERSON_SUCCESSFUL,
  EDIT_PERSON_FAILED,
  DELETE_PERSON,
  DELETE_PERSON_SUCCESSFUL,
  DELETE_PERSON_FAILED,
  SYNC_PERSON_ERP,
  SYNC_PERSON_ERP_SUCCESSFUL,
  SYNC_PERSON_ERP_FAILED,
  UPLOAD_PHOTO_PERSON,
  UPLOAD_PHOTO_PERSON_SUCCESSFUL,
  UPLOAD_PHOTO_PERSON_FAILED,
} from "./actionTypes"

export const getPersons = (withButtons, cb, erp) => ({
  type: GET_PERSONS,
  payload: {withButtons, cb, erp}
})

export const getPersonsSuccessful = persons => ({
  type: GET_PERSONS_SUCCESSFUL,
  payload: persons,
})

export const createPerson = (person, cb) => {
  return {
    type: CREATE_PERSON,
    payload: { person, cb }
  }
}

export const createPersonSuccessful = person => {
  return {
    type: CREATE_PERSON_SUCCESSFUL,
    payload: person,
  }
}

export const createPersonFailed = person => {
  return {
    type: CREATE_PERSON_FAILED,
    payload: person,
  }
}

export const editPerson = (person, cb) => {
  return {
    type: EDIT_PERSON,
    payload: { person, cb }
  }
}

export const editPersonSuccessful = person => {
  return {
    type: EDIT_PERSON_SUCCESSFUL,
    payload: person,
  }
}

export const editPersonFailed = person => {
  return {
    type: EDIT_PERSON_FAILED,
    payload: person,
  }
}

export const deletePerson = (person, cb) => {
  return {
    type: DELETE_PERSON,
    payload: { person, cb }
  }
}

export const deletePersonSuccessful = person => {
  return {
    type: DELETE_PERSON_SUCCESSFUL,
    payload: person,
  }
}

export const deletePersonFailed = person => {
  return {
    type: DELETE_PERSON_FAILED,
    payload: person,
  }
}

export const syncPersonERP = (person, cb) => {
  return {
    type: SYNC_PERSON_ERP,
    payload: { person, cb }
  }
}

export const syncPersonERPSuccessful = person => {
  return {
    type: SYNC_PERSON_ERP_SUCCESSFUL,
    payload: person,
  }
}

export const syncPersonERPFailed = person => {
  return {
    type: SYNC_PERSON_ERP_FAILED,
    payload: person,
  }
}

export const uploadPhotoPerson = (photoPerson, cb) => {
  return {
    type: UPLOAD_PHOTO_PERSON,
    payload: { photoPerson, cb }
  }
}

export const uploadPhotoPersonSuccessful = photoPerson => {
  return {
    type: UPLOAD_PHOTO_PERSON_SUCCESSFUL,
    payload: photoPerson,
  }
}

export const uploadPhotoPersonFailed = photoPerson => {
  return {
    type: UPLOAD_PHOTO_PERSON_FAILED,
    payload: photoPerson,
  }
}