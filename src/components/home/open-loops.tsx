import { useLifeOsStore } from '@/store/lifeOsStore'
import { openLoops } from '@/lib/analytics'
import { LifeObjectRow } from '@/components/shared/life-object-row'
import { StaggerList, StaggerItem } from '@/components/shared/stagger-list'

export function OpenLoops() {
  const objects = useLifeOsStore((s) => s.lifeObjects)
  const loops = openLoops(objects).slice(0, 5)

  if (loops.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        Nothing open right now. Capture something to get started.
      </p>
    )
  }

  return (
    <StaggerList className="flex flex-col gap-2">
      {loops.map((object) => (
        <StaggerItem key={object.id}>
          <LifeObjectRow object={object} />
        </StaggerItem>
      ))}
    </StaggerList>
  )
}
