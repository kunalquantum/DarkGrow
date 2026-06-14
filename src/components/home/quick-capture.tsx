import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { LIFE_OBJECT_TYPES } from '@/lib/types'
import { typeLabel } from '@/lib/life-object-meta'

export function QuickCapture() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<(typeof LIFE_OBJECT_TYPES)[number]>('note')
  const createLifeObject = useLifeOsStore((s) => s.createLifeObject)
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const object = createLifeObject({ type, title: trimmed })
    setTitle('')
    navigate(`/object/${object.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Capture a thought, idea, or moment..."
        className="flex-1"
      />
      <div className="flex gap-2">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof LIFE_OBJECT_TYPES)[number])}
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
    </form>
  )
}
