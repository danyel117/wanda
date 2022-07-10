import aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'eu-west-2',
  signatureVersion: 'v4',
});

const s3 = new aws.S3();

const transcribe = new aws.TranscribeService();

export { s3, transcribe };
