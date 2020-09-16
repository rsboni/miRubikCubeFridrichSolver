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
  const [device, setDevice] = useState(undefined)
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
      })
      device.addEventListener('gattserverdisconnected', () => {
        disconnectFromBluetoothDevice(device)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const OnSolution = () => {
    const newSolution = solver(parseSolution(cubeState), { partitioned: true })
    newSolution.cross = newSolution.cross
      .toString()
      .replace(/prime/g, "'")
      .replace(/,/g, ' ')
    newSolution.f2l = newSolution.f2l
      .toString()
      .replace(/prime/g, "'")
      .replace(/,/g, ' ')
    newSolution.oll = newSolution.oll
      .toString()
      .replace(/prime/g, "'")
      .replace(/,/g, ' ')
    newSolution.pll = newSolution.pll
      .toString()
      .replace(/prime/g, "'")
      .replace(/,/g, ' ')
    setSolution(newSolution)
  }

  return (
    <div className='App'>
      <CubeContainer cubeState={getColors(cubeState)} />
      {!device ? (
        <div>
          <button className='button' onClick={() => onClick()}>
            CONNECT
          </button>
        </div>
      ) : (
        ''
      )}
      {solution === 'SOLVED' ? (
        <h1>SOLVED!!</h1>
      ) : solution ? (
        <div>
          {solution.cross.length > 3 ? (
            <div>
              <h5>Cross</h5>
              <p>{solution.cross}</p>
            </div>
          ) : (
            ''
          )}
          {solution.f2l.length > 3 ? (
            <div>
              <h5>F2L</h5>
              <p>{solution.f2l}</p>
            </div>
          ) : (
            ''
          )}
          {solution.oll.length ? (
            <div>
              <h5>OLL</h5>
              <p>{solution.oll}</p>
            </div>
          ) : (
            ''
          )}
          {solution.pll.length ? (
            <div>
              <h5>PLL</h5>
              <p>{solution.pll}</p>
            </div>
          ) : (
            ''
          )}
          <div>
            <button className='button' onClick={() => OnSolution()}>
              new solution
            </button>
          </div>
        </div>
      ) : (
        ''
      )}
      {!solution && device ? (
        <button className='button' onClick={() => OnSolution()}>
          Solution
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

export default App
