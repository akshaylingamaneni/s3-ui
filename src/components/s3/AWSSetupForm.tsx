"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AWSCredentialsManager, BucketConnectionMethod } from '@/lib/aws/credentials';

export function AWSSetupForm() {
  const [credentials, setCredentials] = useState<BucketConnectionMethod>({
    type: 'iam_user',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1'
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCredentialChange = (field: keyof BucketConnectionMethod, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCredentials = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await fetch('/api/aws/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKeyId: credentials.accessKeyId,
          secretAccessKey: credentials.secretAccessKey,
          region: credentials.region,
        }),
      });

      const data = await response.json();
      if (!data.valid) {
        setValidationError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setValidationError('Error validating credentials. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accessKeyId">Access Key ID</Label>
        <Input
          id="accessKeyId"
          type="text"
          value={credentials.accessKeyId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            handleCredentialChange('accessKeyId', e.target.value)
          }
          placeholder="Enter your AWS Access Key ID"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secretAccessKey">Secret Access Key</Label>
        <Input
          id="secretAccessKey"
          type="password"
          value={credentials.secretAccessKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            handleCredentialChange('secretAccessKey', e.target.value)
          }
          placeholder="Enter your AWS Secret Access Key"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Input
          id="region"
          type="text"
          value={credentials.region}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            handleCredentialChange('region', e.target.value)
          }
          placeholder="Enter AWS region (e.g., us-east-1)"
        />
      </div>

      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}

      <Button
        onClick={validateCredentials}
        disabled={isValidating}
      >
        {isValidating ? 'Validating...' : 'Validate Credentials'}
      </Button>
    </div>
  );
} 