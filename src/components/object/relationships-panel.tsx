import { useState } from 'react'
import { Link as LinkIcon, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { RELATIONSHIP_TYPES, type LifeObject, type RelationshipType } from '@/lib/types'
import { TYPE_META } from '@/lib/life-object-meta'

function relationshipLabel(type: RelationshipType): string {
  return type.replace(/_/g, ' ')
}

export function RelationshipsPanel({ object }: { object: LifeObject }) {
  const lifeObjects = useLifeOsStore((s) => s.lifeObjects)
  const relationships = useLifeOsStore((s) => s.relationships)
  const createRelationship = useLifeOsStore((s) => s.createRelationship)
  const deleteRelationship = useLifeOsStore((s) => s.deleteRelationship)

  const otherObjects = lifeObjects.filter((o) => o.id !== object.id)
  const [targetId, setTargetId] = useState(otherObjects[0]?.id ?? '')
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('related_to')

  const related = relationships
    .filter((r) => r.source_id === object.id || r.target_id === object.id)
    .map((r) => {
      const isSource = r.source_id === object.id
      const otherId = isSource ? r.target_id : r.source_id
      const other = lifeObjects.find((o) => o.id === otherId)
      return { relationship: r, other, isSource }
    })
    .filter((r) => r.other)

  function handleAdd() {
    if (!targetId) return
    createRelationship({ source_id: object.id, target_id: targetId, relationship_type: relationshipType })
  }

  return (
    <div className="flex flex-col gap-3">
      {related.length === 0 ? (
        <p className="text-sm text-muted-foreground">No connections yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {related.map(({ relationship, other, isSource }) => {
            if (!other) return null
            const meta = TYPE_META[other.type]
            const Icon = meta.icon
            return (
              <div
                key={relationship.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-md bg-muted ${meta.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <Link to={`/object/${other.id}`} className="truncate text-sm font-medium hover:text-accent">
                    {other.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {isSource
                      ? relationshipLabel(relationship.relationship_type)
                      : `${relationshipLabel(relationship.relationship_type)} (reverse)`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => deleteRelationship(relationship.id)}
                  aria-label="Remove link"
                >
                  <X className="size-4" />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {otherObjects.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="flex-1">
            {otherObjects.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </Select>
          <Select
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
            className="sm:w-40"
          >
            {RELATIONSHIP_TYPES.map((type) => (
              <option key={type} value={type}>
                {relationshipLabel(type)}
              </option>
            ))}
          </Select>
          <Button variant="outline" onClick={handleAdd}>
            <LinkIcon className="size-4" />
            Link
          </Button>
        </div>
      ) : null}
    </div>
  )
}
