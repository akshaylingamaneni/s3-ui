import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AWSSetupForm } from './AWSSetupForm';

interface SetupGuideStep {
  title: string;
  instructions: string[];
}

const setupSteps: SetupGuideStep[] = [
  {
    title: "Create IAM User",
    instructions: [
      "1. Go to AWS IAM Console",
      "2. Click 'Users' and then 'Add user'",
      "3. Enter a username (e.g., 's3-ui-user')",
      "4. Select 'Access key - Programmatic access'",
      "5. Click 'Next: Permissions'",
      "6. Click 'Attach existing policies directly'",
      "7. Search for and select 'AmazonS3ReadOnlyAccess'",
      "8. Complete the user creation"
    ]
  },
  {
    title: "Configure Bucket Policy",
    instructions: [
      "1. Go to S3 Console",
      "2. Select your bucket",
      "3. Click 'Permissions' tab",
      "4. Scroll to 'Bucket policy'",
      "5. Click 'Edit'",
      "6. Add the following policy:",
      `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_USERNAME"
            },
            "Action": [
              "s3:ListBucket",
              "s3:GetObject",
              "s3:PutObject",
              "s3:DeleteObject"
            ],
            "Resource": [
              "arn:aws:s3:::YOUR_BUCKET_NAME",
              "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
          }
        ]
      }`
    ]
  }
];

export function AWSSetupGuide() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">AWS Setup Guide</h2>
      
      <div className="space-y-4">
        {setupSteps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step.instructions.map((instruction, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400">
                  {instruction}
                </p>
              ))}

              {index === 0 && (
                <div className="mt-6">
                  <AWSSetupForm />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 