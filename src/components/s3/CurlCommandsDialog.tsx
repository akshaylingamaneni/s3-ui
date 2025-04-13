// src/components/s3/CurlCommandsDialog.tsx
"use client"

import React, { useState } from 'react'
import { toast } from 'sonner'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Copy, X, Info } from "lucide-react"
import { useTheme } from 'next-themes';

interface CurlCommandsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  commands: string[]
}

export function CurlCommandsDialog({
  isOpen,
  onOpenChange,
  title,
  commands,
}: CurlCommandsDialogProps) {
  const [copiedIndices, setCopiedIndices] = useState<Record<number, boolean>>({})
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Command copied to clipboard')
        
        if (index !== undefined) {
          setCopiedIndices(prev => ({ ...prev, [index]: true }))
          setTimeout(() => {
            setCopiedIndices(prev => ({ ...prev, [index]: false }))
          }, 2000)
        }
      })
      .catch(err => console.error('Failed to copy command', err));
  };

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      callback();
    }
  };

  const CommandItem = ({ command, index }: { command: string, index: number }) => (
    <div 
      key={index} 
      className="flex items-center gap-2 bg-muted dark:bg-neutral-900 p-3 rounded-md relative border border-muted-foreground/10 hover:border-muted-foreground/20" 
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e, () => copyToClipboard(command, index))}
    >
      <div className="flex-grow overflow-hidden">
        <SyntaxHighlighter 
          language="bash" 
          style={isDark ? oneDark : oneLight}
          customStyle={{ 
            margin: 0, 
            padding: '0.75rem',
            borderRadius: '0.375rem',
            overflowX: 'auto',
            fontSize: '0.875rem',
          }}
          wrapLongLines={false}
        >
          {command}
        </SyntaxHighlighter>
      </div>
      <div className="flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" size="sm"
              className="opacity-80 hover:opacity-100" 
              onClick={() => copyToClipboard(command, index)}
            >
              {copiedIndices[index] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy command</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copiedIndices[index] ? "Copied!" : "Copy to clipboard"}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            {title}
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
          <DialogDescription>
            Choose a download method:
          </DialogDescription>
          {commands.length > 1 && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 dark:bg-neutral-800/50 p-3 rounded-md border border-muted-foreground/10 mt-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-sky-600 dark:text-sky-400" />
              <span>
                Tip: For multiple files, create a new folder on your computer first, 'cd' into it, and then run the command(s) there to keep downloads organized.
              </span>
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-6 mt-4 pb-4 flex-grow min-h-0 overflow-y-auto pr-2">
          {commands.length > 2 && (
            <>
              <div className="bg-primary/5 dark:bg-neutral-900 p-4 rounded-md border border-primary/20 dark:border-primary/30">
                <h3 className="font-semibold text-primary dark:text-primary/90 mb-1">Option 1: Parallel Download (Fastest)</h3>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/90 mb-2">Download all files simultaneously with curl's parallel mode</p>
                <CommandItem command={commands[0]} index={0} />
              </div>
              <div className="bg-secondary/5 dark:bg-secondary/10 p-4 rounded-md border border-secondary/20 dark:border-secondary/30">
                <h3 className="font-semibold text-primary dark:text-primary/90 mb-1">Option 2: Single Command</h3>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/90 mb-2">Download all files with one command (sequential)</p>
                <CommandItem command={commands[1]} index={1} />
              </div>
            </>
          )}
            
          {/* <div className={commands.length > 2 ? "mt-6" : ""}>
            <h3 className="font-medium mb-2">
              {commands.length > 2 ? "Individual Commands:" : "Download Command:"}
            </h3>
            <div className="space-y-3">
              {commands.length > 2 
                ? commands.slice(2).map((command, index) => <CommandItem key={index} command={command} index={index + 2} />)
                : commands.map((command, index) => <CommandItem key={index} command={command} index={index} />)
              }
            </div>
          </div> */}
        </div>
        
        {/* {commands.length > 1 && (
          <DialogFooter className="flex-shrink-0 pt-4">
            <Button 
              className="w-full"
              onClick={() => navigator.clipboard.writeText(commands.join('\n\n'))
                .then(() => toast.success('All commands copied to clipboard'))
                .catch(err => console.error('Failed to copy commands', err))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Commands
            </Button>
          </DialogFooter>
        )} */}
      </DialogContent>
    </Dialog>
  )
}