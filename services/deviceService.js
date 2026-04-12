const dbPromise = require('../db/db');

function toJson(doc) {
  return doc ? doc.toJSON() : null;
}

async function validateUserExists(userId) {
  const { users } = await dbPromise;
  const userDoc = await users.findOne(userId).exec();

  if (!userDoc) {
    throw new Error("L'utilisateur associé à ce device n'existe pas");
  }
}

async function ensureUniqueSerialNumber(devicesCollection, serialNumber, excludedId = null) {
  const existing = await devicesCollection.findOne({
    selector: { serialNumber }
  }).exec();

  if (existing && existing.primary !== excludedId) {
    throw new Error('Le numéro de série est déjà utilisé');
  }
}

async function validateDeviceType(type) {
  const allowed = ['laptop', 'smartphone', 'tablet', 'server'];
  if (!allowed.includes(type)) {
    throw new Error('Type de device invalide');
  }
}

async function validateDeviceStatus(status) {
  const allowed = ['active', 'inactive', 'maintenance'];
  if (!allowed.includes(status)) {
    throw new Error('Statut de device invalide');
  }
}

async function getDeviceById(id) {
  const { devices } = await dbPromise;
  const doc = await devices.findOne(id).exec();
  return toJson(doc);
}

async function getAllDevices() {
  const { devices } = await dbPromise;
  const docs = await devices.find().exec();
  return docs.map((doc) => doc.toJSON());
}

async function getDevicesByUser(userId) {
  const { devices } = await dbPromise;
  const docs = await devices.find({
    selector: { userId }
  }).exec();
  return docs.map((doc) => doc.toJSON());
}

async function createDevice({ userId, name, type, serialNumber, status }) {
  const { devices, persistDevices, createId } = await dbPromise;

  await validateUserExists(userId);
  await validateDeviceType(type);
  await validateDeviceStatus(status);
  await ensureUniqueSerialNumber(devices, serialNumber);

  const inserted = await devices.insert({
    id: createId(),
    userId,
    name,
    type,
    serialNumber,
    status
  });

  await persistDevices();
  return inserted.toJSON();
}

async function updateDevice({ id, name, type, serialNumber, status }) {
  const { devices, persistDevices } = await dbPromise;

  const doc = await devices.findOne(id).exec();
  if (!doc) {
    return null;
  }

  await validateDeviceType(type);
  await validateDeviceStatus(status);
  await ensureUniqueSerialNumber(devices, serialNumber, id);

  const updatedDoc = await doc.incrementalPatch({
    name,
    type,
    serialNumber,
    status
  });

  await persistDevices();
  return updatedDoc.toJSON();
}

async function deleteDevice(id) {
  const { devices, persistDevices } = await dbPromise;

  const doc = await devices.findOne(id).exec();
  if (!doc) {
    return false;
  }

  await doc.remove();
  await persistDevices();
  return true;
}

module.exports = {
  getDeviceById,
  getAllDevices,
  getDevicesByUser,
  createDevice,
  updateDevice,
  deleteDevice
};