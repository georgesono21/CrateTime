import mongoClient, { connectMongoClient } from '@/app/libs/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectMongoClient();

  const database = mongoClient.db('dev');
  const userCollection = database.collection('User');

  const aggregationPipeline = [
    {
      $lookup: {
        from: 'Family',
        localField: 'familyIds',
        foreignField: '_id',
        as: 'families',
        pipeline: [
          {
            $lookup: {
              from: 'Pet',
              localField: 'petIds',
              foreignField: '_id',
              as: 'pets',
              pipeline: [
                {
                  $lookup: {
                    from: 'Task',
                    localField: '_id',
                    foreignField: 'petId',
                    as: 'tasks'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ];

  try {
    const usersWithFamiliesPetsAndTasks = await userCollection.aggregate(aggregationPipeline).toArray();
    return NextResponse.json(usersWithFamiliesPetsAndTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data', details: error.message });
  }
}
