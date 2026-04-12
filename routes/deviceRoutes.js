const express = require('express');
const deviceService = require('../services/deviceService');

const router = express.Router();

router.get('/', async (req, res) => {
  const devices = await deviceService.getAllDevices();
  res.json(devices);
});

router.get('/:id', async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.id);

  if (!device) {
    return res.status(404).json({ error: 'Device non trouvé' });
  }

  res.json(device);
});

router.get('/user/:userId/list', async (req, res) => {
  const devices = await deviceService.getDevicesByUser(req.params.userId);
  res.json(devices);
});

router.post('/', async (req, res) => {
  try {
    const created = await deviceService.createDevice(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await deviceService.updateDevice({
      id: req.params.id,
      ...req.body
    });

    if (!updated) {
      return res.status(404).json({ error: 'Device non trouvé' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await deviceService.deleteDevice(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Device non trouvé' });
  }

  res.json({ message: 'Device supprimé' });
});

module.exports = router;