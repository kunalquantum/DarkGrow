import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useLifeOsStore, searchLifeObjects } from '@/store/lifeOsStore'
import { LifeObjectRow } from '@/components/shared/life-object-row'
import { StaggerList, StaggerItem } from '@/components/shared/stagger-list'

export function SearchView() {
  const [query, setQuery] = useState('')
  const lifeObjects = useLifeOsStore((s) => s.lifeObjects)
  const results = searchLifeObjects(lifeObjects, query)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, notes, and tags..."
          className="pl-9"
          autoFocus
        />
      </div>

      {query.trim() === '' ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Start typing to search everything you've captured.
        </p>
      ) : results.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          No matches for "{query}".
        </p>
      ) : (
        <StaggerList className="flex flex-col gap-2">
          {results.map((object) => (
            <StaggerItem key={object.id}>
              <LifeObjectRow object={object} />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  )
}
