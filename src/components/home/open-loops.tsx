import { useLifeOsStore } from '@/store/lifeOsStore'
import { openLoops } from '@/lib/analytics'
import { LifeObjectRow } from '@/components/shared/life-object-row'

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
    <div className="flex flex-col gap-2">
      {loops.map((object) => (
        <LifeObjectRow key={object.id} object={object} />
      ))}
    </div>
  )
}
