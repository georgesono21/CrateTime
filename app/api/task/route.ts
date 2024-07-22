import mongoClient, { connectMongoClient } from '@/app/libs/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  await connectMongoClient();

  const database = mongoClient.db('dev');
  const familyCollection = database.collection('Family');

  let userId;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body', details: error.message });
  }

  const userObjectId = new ObjectId(userId);

  const aggregationPipeline = [
    {
      $match: {
        membersIds: userObjectId
      }
    },
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
              as: 'tasks',
              pipeline: [
                {
                  $lookup: {
                    from: 'User',
                    localField: 'creatorId',
                    foreignField: '_id',
                    as: 'creator'
                  }
                },
                {
                  $lookup: {
                    from: 'User',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
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
    const familiesWithMembersPetsAndTasks = await familyCollection.aggregate(aggregationPipeline).toArray();
    return NextResponse.json(familiesWithMembersPetsAndTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching data', details: error.message });
  }
}
