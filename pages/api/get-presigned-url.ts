import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_UPLOAD,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_UPLOAD,
  region: 'eu-west-2',
});

export const getObjectInBucket = async (
  Bucket: string,
  path: string,
  responseType = 'text/html'
) => {
  const bucketParams = {
    Bucket,
    Key: decodeURIComponent(path),
    ResponseContentType: responseType,
    Expires: 60 * 60 * 24, // 1 day,
  };

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
