import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Welcome to S3 UI
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Sign in to manage your S3 buckets
      </p>
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-transparent shadow-none",
          },
        }}
      />
    </div>
  );
} 