const deviceService = require('../services/deviceService');

module.exports = {
  device: async ({ id }) => deviceService.getDeviceById(id),

  devices: async () => deviceService.getAllDevices(),

  devicesByUser: async ({ userId }) =>
    deviceService.getDevicesByUser(userId),

  addDevice: async ({ userId, name, type, serialNumber, status }) =>
    deviceService.createDevice({ userId, name, type, serialNumber, status }),

  updateDevice: async ({ id, name, type, serialNumber, status }) =>
    deviceService.updateDevice({ id, name, type, serialNumber, status }),

  deleteDevice: async ({ id }) => deviceService.deleteDevice(id)
};