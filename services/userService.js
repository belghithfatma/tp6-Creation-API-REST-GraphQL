const dbPromise = require('../db/db');

function toJson(doc) {
  return doc ? doc.toJSON() : null;
}

async function findUserByEmail(usersCollection, email) {
  return usersCollection.findOne({
    selector: { email }
  }).exec();
}

async function ensureUniqueEmail(usersCollection, email, excludedId = null) {
  const existing = await findUserByEmail(usersCollection, email);
  if (existing && existing.primary !== excludedId) {
    throw new Error('Adresse e-mail déjà utilisée');
  }
}

async function getUserById(id) {
  const { users } = await dbPromise;
  const doc = await users.findOne(id).exec();
  return toJson(doc);
}

async function getAllUsers() {
  const { users } = await dbPromise;
  const docs = await users.find().exec();
  return docs.map((doc) => doc.toJSON());
}

async function createUser({ name, email, password }) {
  const { users, persistUsers, createId } = await dbPromise;

  await ensureUniqueEmail(users, email);

  const inserted = await users.insert({
    id: createId(),
    name,
    email,
    password
  });

  await persistUsers();
  return inserted.toJSON();
}

async function updateUser({ id, name, email, password }) {
  const { users, persistUsers } = await dbPromise;

  const doc = await users.findOne(id).exec();
  if (!doc) {
    return null;
  }

  await ensureUniqueEmail(users, email, id);

  const updatedDoc = await doc.incrementalPatch({
    name,
    email,
    password
  });

  await persistUsers();
  return updatedDoc.toJSON();
}

async function deleteUser(id) {
  const { users, devices, persistUsers, persistDevices } = await dbPromise;

  const userDoc = await users.findOne(id).exec();
  if (!userDoc) {
    return false;
  }

  const userDevices = await devices.find({
    selector: { userId: id }
  }).exec();

  for (const deviceDoc of userDevices) {
    await deviceDoc.remove();
  }

  await userDoc.remove();

  await persistDevices();
  await persistUsers();

  return true;
}

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};