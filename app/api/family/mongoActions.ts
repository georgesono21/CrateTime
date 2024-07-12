// lib/actions.ts
import client from '@/app/libs/mongodb';
import { Family } from '@prisma/client';
import { ObjectId } from 'mongodb';


async function retrieveUserFamiliesMongo(uId: string): Promise<Family[]> {
  const db = client.db('dev'); // Use your database name here

  const families = await db.collection('Family').aggregate([
    {
      $match: {
        membersIds: new ObjectId(uId)
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
      $unwind: {
        path: '$admin',
        preserveNullAndEmptyArrays: true
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
        from: 'Pet',
        localField: 'petIds',
        foreignField: '_id',
        as: 'pets'
      }
    },
    {
      $lookup: {
        from: 'User',
        localField: 'invitationToUserIds',
        foreignField: '_id',
        as: 'invitationToUsers'
      }
    }
  ]).toArray();

  // if (!families) {
  //   throw new Error(`No families found for user with id ${uId}`);
  // }

    // console.log(`families: ${JSON.stringify(families, null, 2)}`)

  return families as Family[];
}


// export async function GET(req: NextRequest) {
 
//   return new Response(readable, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive',
//     },
//   });
// }


export async function retrieveUserFamiliesWithMongo(uId: string){
  return retrieveUserFamiliesMongo(uId);
}