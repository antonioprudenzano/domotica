import axios from 'axios'

const requestIp = '128.116.170.243'


export const getRooms = async () => {
  let res = await axios.get(`http://${requestIp}:9000/room/`)
  .then(response => {
    return response
  })
  return res
}

export const getRoomByID = async (id) => {
  let res = await axios.get(`http://${requestIp}:9000/room/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const updateThermostatInfo = async (id, data) => {
  let res = await axios.patch(`http://${requestIp}:9000/thermostat/${id}/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const updateLightInfo = async (id, data) => {
  let res = await axios.patch(`http://${requestIp}:9000/light/${id}/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const getThermostatInfo = async (id) => {
  let res = await axios.get(`http://${requestIp}:9000/thermostat/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const getLightInfo = async (id) => {
  let res = await axios.get(`http://${requestIp}:9000/light/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const deleteRoom = async (id) => {
  let res = await axios.delete(`http://${requestIp}:9000/room/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const deleteThermostat = async (id) => {
  let res = await axios.delete(`http://${requestIp}:9000/thermostat/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const deleteLight = async (id) => {
  let res = await axios.delete(`http://${requestIp}:9000/light/${id}/`)
  .then(response => {
    return response
  })
  return res
}

export const addLight = async(data) => {
  let res = await axios.post(`http://${requestIp}:9000/light/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const addThermostat = async(data) => {
  let res = await axios.post(`http://${requestIp}:9000/thermostat/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const addRoom = async(data) => {
  let res = await axios.post(`http://${requestIp}:9000/room/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const analyzePhrase = async(data) => {
  let res = await axios.post(`http://${requestIp}:9000/analyze/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}

export const recognizeAudio = async(data) => {
  let res = await axios.post(`http://${requestIp}:9000/recognize/`, data, {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then(response => {
    return response
  })
  return res
}