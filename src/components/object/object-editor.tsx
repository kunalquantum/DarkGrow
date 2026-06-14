import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { LIFE_OBJECT_STATUSES, LIFE_OBJECT_TYPES, type LifeObject } from '@/lib/types'
import { statusLabel, typeLabel } from '@/lib/life-object-meta'

/** Remount this component (via `key={object.id}`) when navigating between objects so local state resets. */
export function ObjectEditor({ object }: { object: LifeObject }) {
  const updateLifeObject = useLifeOsStore((s) => s.updateLifeObject)

  const [title, setTitle] = useState(object.title)
  const [body, setBody] = useState(object.body)
  const [tagsInput, setTagsInput] = useState(object.tags.join(', '))

  function commitTitle() {
    const trimmed = title.trim()
    if (trimmed && trimmed !== object.title) {
      updateLifeObject(object.id, { title: trimmed })
    } else {
      setTitle(object.title)
    }
  }

  function commitBody() {
    if (body !== object.body) {
      updateLifeObject(object.id, { body })
    }
  }

  function commitTags() {
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (tags.join(', ') !== object.tags.join(', ')) {
      updateLifeObject(object.id, { tags })
    }
    setTagsInput(tags.join(', '))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={commitTitle} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            id="type"
            value={object.type}
            onChange={(e) => updateLifeObject(object.id, { type: e.target.value as LifeObject['type'] })}
          >
            {LIFE_OBJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {typeLabel(type)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={object.status}
            onChange={(e) => updateLifeObject(object.id, { status: e.target.value as LifeObject['status'] })}
          >
            {LIFE_OBJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Notes</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={commitBody}
          placeholder="Write anything..."
          className="min-h-32"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onBlur={commitTags}
          placeholder="comma, separated, tags"
        />
      </div>
    </div>
  )
}
