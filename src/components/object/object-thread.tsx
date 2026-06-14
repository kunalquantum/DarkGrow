import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { relativeTime } from '@/lib/format'

export function ObjectThread({ objectId }: { objectId: string }) {
  const threadEntries = useLifeOsStore((s) => s.threadEntries)
  const addThreadEntry = useLifeOsStore((s) => s.addThreadEntry)
  const deleteThreadEntry = useLifeOsStore((s) => s.deleteThreadEntry)
  const [content, setContent] = useState('')

  const sorted = threadEntries
    .filter((entry) => entry.object_id === objectId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed) return
    addThreadEntry(objectId, trimmed)
    setContent('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a thought, update, or next step to this thread..."
          className="min-h-20"
        />
        <Button
          onClick={handleSubmit}
          variant="accent"
          size="sm"
          className="self-end"
          disabled={!content.trim()}
        >
          <Send className="size-3.5" />
          Post update
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No updates yet — start the thread above.</p>
      ) : (
        <div className="relative flex flex-col gap-3 border-l border-border pl-4">
          <AnimatePresence initial={false}>
            {sorted.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border-2 border-background bg-accent" />
                <div className="group rounded-lg border border-border bg-card p-3">
                  <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{relativeTime(entry.created_at)}</span>
                    <button
                      type="button"
                      onClick={() => deleteThreadEntry(entry.id)}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
                      aria-label="Remove update"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
