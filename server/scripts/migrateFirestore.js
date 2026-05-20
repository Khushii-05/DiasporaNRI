require('dotenv').config();
const { initFirebaseAdmin } = require('../firebaseAdmin');
const { connectDb } = require('../db');
const Media = require('../models/Media');
const Achievement = require('../models/Achievement');

async function migrateMedia(firestore) {
  const snapshot = await firestore.collection('media').get();
  let created = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const title = data.title || '';
    const description = data.description || '';
    const type = data.type || 'image';

    if (!title || !description) {
      skipped += 1;
      continue;
    }

    const existing = await Media.findOne({ title, description, type }).lean();
    if (existing) {
      skipped += 1;
      continue;
    }

    await Media.create({
      title,
      description,
      type,
      fileUrl: data.fileUrl || '',
      fileKey: ''
    });
    created += 1;
  }

  return { created, skipped };
}

function normalizeDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function migrateAchievements(firestore) {
  const snapshot = await firestore.collection('achievements').get();
  let created = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const title = data.title || '';
    const description = data.description || '';
    const date = normalizeDate(data.date) || new Date();

    if (!title || !description) {
      skipped += 1;
      continue;
    }

    const existing = await Achievement.findOne({ title, description, date }).lean();
    if (existing) {
      skipped += 1;
      continue;
    }

    await Achievement.create({
      title,
      description,
      date,
      fileUrl: data.fileUrl || '',
      fileKey: ''
    });
    created += 1;
  }

  return { created, skipped };
}

async function run() {
  initFirebaseAdmin();
  await connectDb();
  const firestore = require('firebase-admin').firestore();

  console.log('Starting Firestore -> Mongo migration (metadata only)...');

  const mediaResult = await migrateMedia(firestore);
  console.log(`Media: created=${mediaResult.created}, skipped=${mediaResult.skipped}`);

  const achievementResult = await migrateAchievements(firestore);
  console.log(`Achievements: created=${achievementResult.created}, skipped=${achievementResult.skipped}`);

  console.log('Migration complete.');
  process.exit(0);
}

run().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
