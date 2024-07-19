import mongoClient, { connectMongoClient } from '@/app/libs/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await connectMongoClient();

  const database = mongoClient.db('dev');
  const familyCollection = database.collection('Family');

  const aggregationPipeline = [
    {
      $lookup: {
        from: 'User',
        localField: 'membersIds',
        foreignField: '_id',
        as: 'familyMembers'
      }
    },
    {
      $lookup: {
        from: 'User',
        localField: 'adminId',
        foreignField: '_id',
        as: 'admin'
      }
    },
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
  ];

  try {
    const familiesWithMembersPetsAndTasks = await familyCollection.aggregate(aggregationPipeline).toArray();
    return NextResponse.json(familiesWithMembersPetsAndTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data', details: error.message });
  }
}
