import requests, time, logging, json, threading

def genActualTemp(thermostatID):
  r = requests.get('http://127.0.0.1:9000/thermostat/' + str(thermostatID) +'/')
  response = r.json()
  if response['actual_temperature'] < response['temperature_set']:
    print('Setting temp '+ str(response['actual_temperature']+1) + ' on thermostat ' + str(response['id']))
    payload = {'actual_temperature': response['actual_temperature']+1}
    r = requests.patch(
      'http://127.0.0.1:9000/thermostat/' + str(thermostatID) +'/', data=json.dumps(payload), headers={'Content-type': 'application/json'}
      )
  elif response['actual_temperature'] > response['temperature_set']:
    print('Setting temp '+ str(response['actual_temperature']-1) + ' on thermostat ' + str(response['id']))
    payload = {'actual_temperature': response['actual_temperature']-1}
    r = requests.patch(
      'http://127.0.0.1:9000/thermostat/' + str(thermostatID) +'/', data=json.dumps(payload), headers={'Content-type': 'application/json'}
      )
    
def roomHandling(roomObj):
  for thermostat in roomObj['thermostats']:
    genActualTemp(thermostat['id'])
  

while True:
  roomThreads = list()
  r = requests.get('http://127.0.0.1:9000/room/')
  jsonResponse = r.json()
  for room in jsonResponse:
    x = threading.Thread(target=roomHandling, args=(room, ), daemon=True)
    roomThreads.append(x)
    x.start()
  for index, thread in enumerate(roomThreads):
    thread.join()
  time.sleep(10)