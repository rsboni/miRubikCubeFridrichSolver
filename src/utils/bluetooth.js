const SERVICE_UUID = '0000aadb-0000-1000-8000-00805f9b34fb'
const CHARACTERISTIC_UUID = '0000aadc-0000-1000-8000-00805f9b34fb'

export const isWebBluetoothSupported = 'bluetooth' in navigator

export const connectToBluetoothDevice = async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]
    })
    const server = await device.gatt.connect()
    window.mdevice = device
    window.mserver = server
    return { device, server }
  } catch (err) {
    return err
  }
}

export const startNotifications = async server => {
  try {
    const service = await server.getPrimaryService(SERVICE_UUID)
    window.mservice = service
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID)
    window.mcharacteristic = characteristic
    await characteristic.startNotifications()
    return characteristic
  } catch (error) {
    return error
  }
}

export const disconnectFromBluetoothDevice = device => {
  if (!device || !device.gatt.connected) return Promise.resolve()
  return device.gatt.disconnect()
}
