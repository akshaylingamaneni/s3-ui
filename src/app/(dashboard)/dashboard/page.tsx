"use client"

import { useS3Files } from '@/hooks/useS3Files'
import { useBucketStore } from '@/store/bucketStore'
import { columns } from '@/components/s3/columns'
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
import { useAWSStore } from '@/store/aws-store'
import { S3File } from '@/hooks/useS3Files'
import { useCallback } from 'react'
import React from 'react'
import { toast } from 'sonner'
export default function Page() {
  const { currentBucket, currentPath, setCurrentPath } = useBucketStore()
  const { activeProfile } = useAWSStore()
  const {
    files,
    isLoading,
  } = useS3Files(currentBucket, activeProfile?.profileName, currentPath || '')

  const handleObjectClick = (file: S3File) => {
    if (file.isDirectory) {
      setTimeout(() => {
        setCurrentPath(file.key);
      }, 50);
    }
    console.log('file', file);
  }

  const handleFileAction = async (action: string, item: any) => {
    console.log('handleFileAction', action, item);
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
          // Directly open the URL in a new tab to download
          window.open(data.url, '_blank');
          toast.success(`Downloading ${item.name}`);
        }
        
        // For a directory
        if (data.urls && data.urls.length > 0) {
          // Use browser's download capabilities for multiple files
          // Due to browser limitations, we offer the user to download each file
          toast.success(`Found ${data.urls.length} files. Starting downloads...`);
          
          // Download files one by one with a small delay to prevent browser blocking
          data.urls.forEach((fileData: any, index: number) => {
            setTimeout(() => {
              const a = document.createElement('a');
              a.href = fileData.url;
              a.download = fileData.name;
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }, index * 300); // 300ms delay between downloads
          });
        }
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download');
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
        {!currentBucket ? (
          <EmptyState />
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
    </div>
  )
}
