import { useLifeOsStore } from '@/store/lifeOsStore'
import { groupLabel } from '@/lib/format'
import { LifeObjectRow } from '@/components/shared/life-object-row'
import { StaggerList, StaggerItem } from '@/components/shared/stagger-list'

export function TimelineList() {
  const lifeObjects = useLifeOsStore((s) => s.lifeObjects)

  if (lifeObjects.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        Nothing captured yet.
      </p>
    )
  }

  const sorted = [...lifeObjects].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  const groups: { label: string; objects: typeof sorted }[] = []
  for (const object of sorted) {
    const label = groupLabel(object.created_at)
    const group = groups.find((g) => g.label === label)
    if (group) {
      group.objects.push(object)
    } else {
      groups.push({ label, objects: [object] })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">{group.label}</h2>
          <StaggerList className="flex flex-col gap-2">
            {group.objects.map((object) => (
              <StaggerItem key={object.id}>
                <LifeObjectRow object={object} />
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      ))}
    </div>
  )
}
