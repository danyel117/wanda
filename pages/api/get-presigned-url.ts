import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const getObjectInBucket = async (
  Bucket: string,
  path: string,
  responseType = 'text/html'
) => {
  const bucketParams = {
    Bucket,
    Key: decodeURIComponent(path),
    ResponseContentType: responseType,
    Expires: 60 * 60 * 48, // 2 days,
  };

  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'eu-west-2',
  });

  return s3.getSignedUrl('getObject', bucketParams);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { bucket, path } = req.body;
    const session: any = await getSession({ req });
    if (session?.user) {
      const presignedUrl = await getObjectInBucket(bucket, path);
      return res.status(200).json({ url: presignedUrl });
    }
    return res.status(401).send('unauthorized');
  }
  return res.status(404);
}
