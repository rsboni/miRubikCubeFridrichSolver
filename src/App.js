import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Container from '@material-ui/core/Container'
import {
  connectToBluetoothDevice,
  startNotifications,
  disconnectFromBluetoothDevice
} from './utils/bluetooth'
import { parseCube, getColors, parseSolution } from './utils/cubeParser'
import solver from 'rubiks-cube-solver'
import './App.css'
import CubeContainer from './components/CubeContainer'
import { Paper } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

function App () {
  const classes = useStyles()

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
  const parsedNewSolution = solution => {
    Object.entries(solution).forEach(([key, val]) => {
      const newMethod = val
        .toString()
        .replace(/prime/g, "'")
        .replace(/,/g, ' ')
      console.log('key:', key)
      console.log('value:', val)
      console.log('newMethod:', newMethod)
      solution[key] = newMethod.length > 3 ? newMethod : undefined
    })
    return solution
  }
  const OnSolution = () => {
    const newSolution = solver(parseSolution(cubeState), { partitioned: true })
    console.log(newSolution)
    const parsedSolution = parsedNewSolution(newSolution)
    console.log(parsedSolution)
    setSolution(parsedSolution)
  }

  return (
    <div className='App'>
      {/* <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Rubik Cube
            </Typography>
          </Toolbar>
        </AppBar>
      </div> */}
      <CubeContainer
        cubeState={getColors(cubeState)}
        className='CubeContainer'
      />
      <div>
        {!device ? (
          <div>
            <Button
              variant='contained'
              size='medium'
              className='button'
              color='primary'
              onClick={() => onClick()}
              fullWidth
            >
              CONNECT
            </Button>
          </div>
        ) : (
          ''
        )}
        { solution ? (
          <div>
            {solution.cross ? (
              <div>
                <h5>Cross</h5>
                <Typography>{solution.cross}</Typography>
              </div>
            ) : solution.f2l ? (
              <div>
                <h5>F2L</h5>
                <Typography>{solution.f2l}</Typography>
              </div>
            ) : solution.oll ? (
              <div>
                <h5>OLL</h5>
                <Typography>{solution.oll}</Typography>
              </div>
            ) : solution.pll ? (
              <div>
                <h5>PLL</h5>
                <Typography>{solution.pll}</Typography>
              </div>
            ) : (
              'Solved!'
            )}
          </div>
        ) : (
          ''
        )}
        { device ? (
          <Button
            variant='contained'
            fullWidth
            className='button'
            color='primary'
            onClick={() => OnSolution()}
          >
            {solution ? 'Solution' : 'New Solution'}
          </Button>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default App
