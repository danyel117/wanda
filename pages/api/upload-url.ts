import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

// first we need to disable the default body parser
export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  aws.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'eu-west-2',
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();

  if (req.method === 'GET') {
    const fileSize = Array.isArray(req.query.size)
      ? req.query.size[0]
      : req.query.size;

    const fileName = Array.isArray(req.query.file)
      ? req.query.file[0]
      : req.query.file;

    const bucket = Array.isArray(req.query.bucket)
      ? req.query.bucket[0]
      : req.query.bucket;

    const Conditions = [
      { bucket },
      ['content-length-range', 0, 10485760 * 1000], // 10GB
    ];

    if (parseFloat(fileSize) < 1024 * 1024 * 30) {
      // 30MB
      const presignedPost = await s3.createPresignedPost({
        Bucket: bucket,
        Fields: {
          key: fileName,
        },
        Expires: 60, // seconds
        Conditions,
      });
      const finalURL = `https://${bucket}.s3.amazonaws.com/${presignedPost.fields.key}`;

      return res
        .status(200)
        .json({ data: { presignedPost, finalURL }, isMultipart: false });
    }
    return s3.createMultipartUpload(
      {
        Bucket: bucket,
        Key: fileName,
        ContentType: 'application/octet-stream',
        StorageClass: 'STANDARD',
      },
      (err: any, data: any) => {
        if (err) {
          res.status(500).json({ error: err });
          return res.end();
        }

        return res.status(200).json({ data, isMultipart: true });
      }
    );
  }

  if (req.method === 'POST') {
    const { key, id, bucket } = req.body;

    const parts = await s3
      .listParts({
        Bucket: bucket,
        Key: key,
        UploadId: id,
      })
      .promise();
    if (parts) {
      const chunks = parts?.Parts?.map((p: any) => ({
        ETag: p.ETag,
        PartNumber: p.PartNumber,
      }));

      const params = {
        Bucket: bucket,
        Key: key,
        MultipartUpload: {
          Parts: [...(chunks ?? [])],
        },
        UploadId: id,
      };
      const complete = await s3.completeMultipartUpload(params).promise();

      return res.status(200).json({ complete });
    }

    return res.status(500).json({ error: 'no parts' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
