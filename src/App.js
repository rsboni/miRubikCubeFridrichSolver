import React, { useState } from 'react'
import { connectToBluetoothDevice, startNotifications, disconnectFromBluetoothDevice } from './utils/bluetooth'
import { parseCube, getColors } from './utils/cubeParser'
import './App.css'
import CubeContainer from './components/CubeContainer'

function App () {
  const [cubeState, setCubeState] = useState('bbbbbbbbboooooooooyyyyyyyyygggggggggrrrrrrrrrwwwwwwwww')
  const [device, setDevice] = useState(null)
  const faceColorMap = ['g', 'y', 'r', 'w', 'o', 'b']

  const onClick = async () => {
    try {
      const { server, device } = await connectToBluetoothDevice()
      setDevice(device)
      const characteristic = await startNotifications(server)
      console.log(characteristic)
      characteristic.addEventListener('characteristicvaluechanged', event => {
        const { value } = event.target // 20 bytes sent by the cube
        const cubeState = parseCube(value) // We parse it to an array of 54 colors (1...6)
          .map(faceletColor => faceColorMap[faceletColor - 1])
          .join('')
        setCubeState(cubeState)
      })
      device.addEventListener('gattserverdisconnected', () => {
        disconnectFromBluetoothDevice(device)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='App'>
      <CubeContainer cubeState={getColors(cubeState)} />
      {/* <img
        alt='Rubik cube'
        src={`http://cube.crider.co.uk/visualcube.php?fmt=svg&r=x-90y-120x-20&size=300&fc=${cubeState}`}
      /> */}
      <div>
        <button
          onClick={() => onClick()}
        >
          connect
        </button>
      </div>
    </div>
  )
}

export default App
