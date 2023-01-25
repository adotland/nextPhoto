import { withSentry } from "@sentry/nextjs";
import clientPromise from '../../../lib/mongodb'

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(401).send({ error: 'bad request' });
  const { isIncrement, slug, count } = JSON.parse(req.body);
  try {
    const client = await clientPromise;
    console.log('is connected')
    const db = client.db(process.env.MONGODB_DBNAME);
    const likes = db.collection('likes');

    let newCount;
    if (isIncrement === true) {
      newCount = count + 1;
    } else if (isIncrement === false) {
      if (count <= 0) {
        newCount = 0;
      } else {
        newCount = count - 1;
      }
    } else {
      res.status(500).json({ error: `error updating like count for ${slug}` })
    }
    const filter = { slug };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        count: newCount
      },
    };
    const result = await likes.updateOne(filter, updateDoc, options);
    if (result.modifiedCount) {
      res.status(200).json({ data: newCount })
    } else {
      res.status(500).json({ error: `error updating like count for ${slug}` });
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: `error updating like count for ${slug}` })
  }
}



export default withSentry(handler);
