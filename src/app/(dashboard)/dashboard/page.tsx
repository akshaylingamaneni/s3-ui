"use client"

import { columns } from '@/components/s3/columns'
import { CurlCommandsDialog } from '@/components/s3/CurlCommandsDialog'
import { DataTable } from '@/components/s3/DataTable'
import { EmptyState } from '@/components/s3/EmptyState'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { S3File, useS3Files } from '@/hooks/useS3Files'
import { useAWSProfileStore } from '@/store/aws-store'
import { useBucketStore } from '@/store/bucketStore'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function Page() {
  const { currentBucket, currentPath, setCurrentPath } = useBucketStore()
  const { activeProfile } = useAWSProfileStore()
  const {
    files,
    isLoading,
  } = useS3Files(currentBucket, activeProfile?.profileName, currentPath || '')

  const [curlCommands, setCurlCommands] = useState<string[]>([])
  const [showCurlDialog, setShowCurlDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")

  const handleObjectClick = (file: S3File) => {
    if (file.isDirectory) {
      setTimeout(() => {
        setCurrentPath(file.key);
      }, 50);
    }
  }

  const handleFileAction = async (action: string, item: any) => {
    if (action === 'download') {
      try {
        const response = await fetch('/api/s3/get-download-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: item.key,
            bucket: currentBucket,
            profileName: activeProfile?.profileName,
            isDirectory: item.isDirectory,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate download URL');
        }
        
        // For a single file
        if (data.url) {
          const filename = item.key.split('/').pop();
          const curlCommand = `curl -o "${filename}" "${data.url}"`;
          
          setCurlCommands([curlCommand]);
          setDialogTitle(`Download ${filename}`);
          setShowCurlDialog(true);
        }
        
        // For a directory
        if (data.urls && data.urls.length > 0) {
          // Generate individual curl commands (keep these as reference)
          const individualCommands = data.urls.map((fileData: any) => {
            const filename = fileData.name;
            return `curl -o "${filename}" "${fileData.url}"`;
          });
          
          // Generate a single curl command with multiple -O flags
          const urlsOnly = data.urls.map((fileData: any) => `"${fileData.url}"`).join(" -O ");
          const multipleUrlCommand = `curl -O ${urlsOnly}`;
          
          // Generate parallel curl command
          const parallelCommand = `curl --parallel -O ${urlsOnly}`;
          
          // Set all commands to be displayed
          setCurlCommands([
            parallelCommand,    // First option: parallel downloads
            multipleUrlCommand, // Second option: sequential in one command
            ...individualCommands // Still keep individual commands
          ]);
          
          setDialogTitle(`Download ${data.urls.length} files`);
          setShowCurlDialog(true);
        }
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to generate download commands');
      }
    }
  }

  // Parse the current path into segments for breadcrumbs
  const pathSegments = currentPath ? currentPath.split('/').filter(Boolean) : [];
  
  // Generate paths for each breadcrumb segment
  const breadcrumbPaths = pathSegments.map((_, index) => {
    return pathSegments.slice(0, index + 1).join('/');
  });

  // Function to navigate to a specific path segment
  const navigateToPath = (path: string) => {
    setTimeout(() => {
      setCurrentPath(path);
    }, 50);
  };

  // Navigate to root
  const navigateToRoot = () => {
    setTimeout(() => {
      setCurrentPath('');
    }, 50);
  };

  const generateDownloadScript = (commands: string[]) => {
    const scriptLines = [
      '#!/bin/bash',
      '# Download script for multiple files',
      'echo "Starting download of ' + commands.length + ' files..."',
      ''
    ];
    
    // Add all curl commands
    commands.forEach(cmd => {
      scriptLines.push(cmd);
    });
    
    scriptLines.push('');
    scriptLines.push('echo "All downloads completed!"');
    
    return scriptLines.join('\n');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb navigation */}
      {currentBucket && (
        <div className="mx-4 mt-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={navigateToRoot} className="cursor-pointer">
                  {currentBucket}
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              {pathSegments.map((segment, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === pathSegments.length - 1 ? (
                      <BreadcrumbPage>{segment}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        onClick={() => navigateToPath(breadcrumbPaths[index])}
                        className="cursor-pointer"
                      >
                        {segment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 mx-4">
        {!activeProfile ? (
          <EmptyState 
            title="No profile selected"
            description="Select an AWS profile to get started"
            variant="bucket"
          />
        ) : !currentBucket ? (
          <EmptyState 
            title="No bucket selected"
            description="Select a bucket to view its contents"
            variant="bucket"
          />
        ) : files && files.length === 0 && !isLoading ? (
          <EmptyState 
            title="Empty bucket"
            description="This bucket has no files or folders"
            actionLabel="Upload files"
            onAction={() => {
              // TODO: Implement file upload
              console.log('Upload files')
            }}
          />
        ) : (
          <DataTable 
            columns={columns(handleFileAction)} 
            data={files || []} 
            isLoading={isLoading}
            onRowClick={handleObjectClick}
            onActionClick={handleFileAction}
          />
        )}
      </div>

      {/* Dialog for curl commands */}
      <CurlCommandsDialog
        isOpen={showCurlDialog}
        onOpenChange={setShowCurlDialog}
        title={dialogTitle}
        commands={curlCommands}
      />
    </div>
  )
}
