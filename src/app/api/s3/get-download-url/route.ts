import { AWSProfile, getS3Client } from "@/lib/aws/s3-client";
import redis from "@/lib/redis";
import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { decrypt } from "@/lib/encryption";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, bucket, profileName, isDirectory } = body;
    const user = await currentUser()
    console.log('get-download-url', body);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const profiles: AWSProfile[] | null = await redis.get(`aws_credentials:${user.id}`) 
    const profile = profiles?.find((p) => p.profileName === profileName)
    if (!key || !bucket) {
      return NextResponse.json({ error: "Missing key or bucket" }, { status: 400 });
    }
    console.log('profile', profile);
    const s3Client = await getS3Client(profile as AWSProfile);
    console.log('s3Client', s3Client);
    if (!s3Client) {
      return NextResponse.json({ error: "Failed to initialize S3 client" }, { status: 500 });
    }
    
    // For single files, just return a presigned URL
    if (!isDirectory) {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      console.log('command', command);
      const url = await getPresignedUrl(s3Client, command, 3600, profile as AWSProfile);
      console.log('url', url);
      return NextResponse.json({ url });
    }
    
    // For directories, list all objects and generate presigned URLs for each
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: key,
    });
    
    const objects = await s3Client.send(listCommand);
    
    if (!objects.Contents || objects.Contents.length === 0) {
      return NextResponse.json({ error: "Folder is empty" }, { status: 404 });
    }
    
    // Generate presigned URLs for each object
    const urls = await Promise.all(
      objects.Contents.filter(obj => obj.Key !== key).map(async (obj) => {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: obj.Key,
        });
        
        const url = await getPresignedUrl(s3Client, command, 3600, profile as AWSProfile);
        
        return {
          key: obj.Key,
          name: obj.Key?.split('/').pop() || '',
          url,
        };
      })
    );
    
    return NextResponse.json({ urls });
    
  } catch (error) {
    console.error("Error generating download URLs:", error);
    return NextResponse.json({ error: "Failed to generate download URLs" }, { status: 500 });
  }
}

async function getPresignedUrl(s3Client: S3Client, command: GetObjectCommand, expiresIn = 3600, profile: AWSProfile) {
  try {
    const bucket = command.input.Bucket;
    const key = command.input.Key;
    console.log('bucket', bucket);
    console.log('key', key);
    const filename = key?.split('/').pop() || 'file';
    const secretAccessKeyDecrypted = await decrypt(profile.secretAccessKey);
   const config = {
        credentials: {
          accessKeyId: profile.accessKeyId,
          secretAccessKey: secretAccessKeyDecrypted,
        },
        endpoint: profile.endpoint,
        forcePathStyle: true,
        region: profile.region,
      };
    console.log('config', config);
    const client = new S3Client(config);
    // Create command with content disposition
    const modifiedCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    // Generate a presigned URL (this is different from sending the command)
    const signedUrl = await getSignedUrl(client, modifiedCommand, { 
      expiresIn
    });
    console.log('signedUrl', signedUrl);
    
    return signedUrl;
  } catch (error) {
    console.error("Error in getPresignedUrl:", error);
    throw error;
  }
} 