# S3 UI

A modern, open-source web interface for managing Amazon S3 buckets. Built with Next.js, TypeScript, and AWS SDK, S3 UI provides a user-friendly way to interact with your S3 storage.

🚧 The repo is in very early stage right now. I am still iterating on all things that will be good to have. 

![S3 UI Screenshot](screenshot.png)

## Features (WIP)

- 🔐 **Secure Authentication** with Clerk
- 🗂️ **Multiple Bucket Management**
  - Quick access to multiple S3 buckets
  - Color coding and tagging
  - Favorites system
  - Recently accessed list
- 📁 **File Operations**
  - Browse files and folders
  - Upload files (drag & drop, multi-file)
  - Download files
  - Delete files/folders
  - Rename files/folders
  - Move files between folders
  - Copy files
  - Preview files
  - File sharing with temporary URLs
  - File versioning support
- 🎨 **Modern UI**
  - Dark/light mode support
  - Responsive design
  - Drag and drop interface
  - Progress indicators
  - Search and filter capabilities
  - Sort options
  - Grid/List view toggle

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **AWS Integration**: AWS SDK for JavaScript
- **Data Fetching**: React Query
- **UI Components**: Shadcn/ui
- **Authentication**: Clerk
- **Data Storage**: Upstash Redis
- **Development Tools**:
  - ESLint
  - Prettier
  - Jest for testing

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- AWS account with S3 access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/s3-ui.git
cd s3-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
AWS_REGION=your_aws_region
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
