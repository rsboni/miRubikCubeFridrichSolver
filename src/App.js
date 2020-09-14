import React, { useState } from 'react'
import {
  connectToBluetoothDevice,
  startNotifications,
  disconnectFromBluetoothDevice
} from './utils/bluetooth'
import { parseCube, getColors, parseSolution } from './utils/cubeParser'
import solver from 'rubiks-cube-solver'
import './App.css'
import CubeContainer from './components/CubeContainer'

function App () {
  const [cubeState, setCubeState] = useState(
    'bbbbbbbbboooooooooyyyyyyyyygggggggggrrrrrrrrrwwwwwwwww'
  )
  const [device, setDevice] = useState(null)
  const [solution, setSolution] = useState(undefined)
  const faceColorMap = ['g', 'y', 'r', 'w', 'o', 'b']

  const onClick = async () => {
    try {
      const { server, device } = await connectToBluetoothDevice()
      setDevice(device)
      const characteristic = await startNotifications(server)
      characteristic.addEventListener('characteristicvaluechanged', event => {
        const { value } = event.target // 20 bytes sent by the cube
        const cubeState = parseCube(value) // We parse it to an array of 54 colors (1...6)
          .map(faceletColor => faceColorMap[faceletColor - 1])
          .join('')
        setCubeState(cubeState)
        setSolution(solver(parseSolution(cubeState), { partitioned: true }))
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
      {device == null ? (
        <div>
          <button className='button' onClick={() => onClick()}>
            connect
          </button>
        </div>
      ) : (
        ''
      )}
      {solution ? (
        <div>
          <h5>Cross</h5>
          <p>{solution.cross.toString().replace(/prime/g, "'").replace(/,/g, ' ')}</p>
          <h5>F2L</h5>
          <p>{solution.f2l.toString().replace(/prime/g, "'").replace(/,/g, ' ')}</p>
          <h5>OLL</h5>
          <p>{solution.oll.toString().replace(/prime/g, "'").replace(/,/g, ' ')}</p>
          <h5>PLL</h5>
          <p>{solution.pll.toString().replace(/prime/g, "'").replace(/,/g, ' ')}</p>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default App
