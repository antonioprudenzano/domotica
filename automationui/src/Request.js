import axios from 'axios'

const requestIp = process.env.REACT_APP_REQUEST_IP
const port = 9000

export const getRooms = async () => {
  return axios.get(`http://${requestIp}:${port}/room/`)
}

export const getRoomByID = async (id) => {
  return axios.get(`http://${requestIp}:${port}/room/${id}/`)
}

export const updateThermostatInfo = async (id, data) => {
  return axios.patch(`http://${requestIp}:${port}/thermostat/${id}/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const updateLightInfo = async (id, data) => {
  return axios.patch(`http://${requestIp}:${port}/light/${id}/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const getThermostatInfo = async (id) => {
  return axios.get(`http://${requestIp}:${port}/thermostat/${id}/`)
}

export const getLightInfo = async (id) => {
  return axios.get(`http://${requestIp}:${port}/light/${id}/`)
}

export const deleteRoom = async (id) => {
  return axios.delete(`http://${requestIp}:${port}/room/${id}/`)
}

export const deleteThermostat = async (id) => {
  return axios.delete(`http://${requestIp}:${port}/thermostat/${id}/`)
}

export const deleteLight = async (id) => {
  return axios.delete(`http://${requestIp}:${port}/light/${id}/`)
}

export const addLight = async(data) => {
  return axios.post(`http://${requestIp}:${port}/light/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const addThermostat = async(data) => {
  return axios.post(`http://${requestIp}:${port}/thermostat/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const addRoom = async(data) => {
  return axios.post(`http://${requestIp}:${port}/room/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const analyzePhrase = async(data) => {
  return axios.post(`http://${requestIp}:${port}/analyze/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}

export const recognizeAudio = async(data) => {
  return axios.post(`http://${requestIp}:${port}/recognize/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
}