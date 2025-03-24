import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AWSSetupGuide } from "@/components/s3/AWSSetupGuide";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Buckets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>All Buckets</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your S3 Buckets
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Welcome to S3 UI</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To get started, you'll need to set up your AWS credentials and configure bucket access.
              Follow the guide below to set up your first bucket.
            </p>
            <AWSSetupGuide />
          </div>
        </div>
      </div>
    </div>
  );
} 