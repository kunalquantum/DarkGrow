import { TimelineList } from '@/components/timeline/timeline-list'

export default function TimelinePage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Timeline</h1>
        <p className="text-sm text-muted-foreground">Everything you've captured, in order.</p>
      </header>
      <TimelineList />
    </div>
  )
}
