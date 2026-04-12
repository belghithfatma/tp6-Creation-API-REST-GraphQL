const express = require('express');
const userService = require('../services/userService');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  res.json(user);
});

router.post('/', async (req, res) => {
  try {
    const created = await userService.createUser(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await userService.updateUser({
      id: req.params.id,
      ...req.body
    });

    if (!updated) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await userService.deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  res.json({ message: 'Utilisateur supprimé avec ses devices' });
});

module.exports = router;