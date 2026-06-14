import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { LIFE_OBJECT_TYPES, type LifeObjectType } from '@/lib/types'
import { TYPE_CAPTURE_PROMPTS, typeLabel } from '@/lib/life-object-meta'
import { cn } from '@/lib/utils'

export function QuickCapture() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<LifeObjectType>('note')
  const [body, setBody] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const createLifeObject = useLifeOsStore((s) => s.createLifeObject)
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const object = createLifeObject({ type, title: trimmed, body, tags })
    setTitle('')
    setBody('')
    setTagsInput('')
    setExpanded(false)
    navigate(`/object/${object.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Capture a thought, idea, or moment..."
          className="flex-1 border-0 bg-transparent px-0 focus-visible:ring-0 sm:px-3 sm:bg-input sm:border sm:border-border"
        />
        <div className="flex gap-2">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as LifeObjectType)}
            className="w-36"
          >
            {LIFE_OBJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </Select>
          <Button type="submit" size="icon" variant="accent" aria-label="Capture">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
        {expanded ? 'Hide details' : 'Add details'}
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-1">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={TYPE_CAPTURE_PROMPTS[type]}
                className="min-h-20"
              />
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="comma, separated, tags"
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  )
}
