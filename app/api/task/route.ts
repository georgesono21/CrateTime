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
    return NextResponse.json({ error: 'Invalid request body'});
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
    return NextResponse.json({ error: 'Error fetching data' });
  }
}



export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const write = (data: string) => {
    writer.write(encoder.encode(data));
  };

  write("event: message\n");
  write("data: Connecting to MongoDB...\n\n");

  await connectMongoClient();

  const database = mongoClient.db('dev');
  const familyCollection = database.collection('Task');

  const familyChangeStream = familyCollection.watch();

  familyChangeStream.on('change', (change: any) => {
    const eventData = JSON.stringify({ type: 'change', data: change });
    write(`pet: event: message\n`);
    write(`data: ${eventData}\n\n`);
  });

  // Clean up on client disconnect
  req.signal.addEventListener('abort', () => {
    familyChangeStream.close();
    writer.close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
