"use client"

import { Button } from '@/components/ui/button'
import { motion } from "motion/react"
import ElasticLine from "@/fancy/components/physics/elastic-line"
import { useRouter } from 'next/navigation'
export default function Home() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    }),
  }

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    }),
  }

  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90 min-h-[60vh] flex items-center">
        {/* Elastic Lines Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ElasticLine 
            strokeWidth={1.5} 
            className="text-primary/20"
            grabThreshold={10}
            releaseThreshold={150}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 15
            }}
            animateInTransition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.15,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h1 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 pb-2"
            >
              Modern S3 Management, Simplified
            </motion.h1>
            <motion.p 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-lg md:text-xl text-muted-foreground"
            >
              A beautiful, intuitive interface for all your S3 buckets. Upload, organize, and share files with ease.
            </motion.p>
            <motion.div 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Button size="lg" className="font-medium text-base" onClick={() => router.push('/dashboard')}>
                Get Started
              </Button>
              {/* <Button size="lg" variant="outline" className="font-medium text-base">
                Learn More
              </Button> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-2xl md:text-3xl font-bold text-center mb-10"
          >
            Powerful Features at Your Fingertips
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                className="bg-muted rounded-xl p-6 shadow-md border border-border hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-gradient-to-r from-primary/5 to-blue-600/5 relative overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-3xl font-bold mb-4"
          >
            Ready to Simplify Your S3 Experience?
          </motion.h2>
          <motion.p 
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Join thousands of developers who have transformed their S3 workflow.
          </motion.p>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <Button size="lg" className="font-medium text-base">
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section> */}
    </div>
  )
}

const features = [
  {
    title: "Multi-Bucket Management",
    description: "Connect to multiple S3 buckets and manage them all from a single interface.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "Drag & Drop Upload",
    description: "Upload files with a simple drag and drop interface. Support for multi-file and folder uploads.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    title: "Secure Authentication",
    description: "Keep your S3 credentials safe with our secure authentication system.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "File Management",
    description: "Create folders, delete files, and organize your S3 storage with ease through an intuitive interface.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "File Sharing",
    description: "Generate temporary URLs to share files with others without giving them access to your bucket.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    title: "Dark & Light Mode",
    description: "Switch between dark and light mode to suit your preference and reduce eye strain.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
]
