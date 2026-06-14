import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Flame, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { activeGoals, goalStreak, goalsMissedYesterday, hasStepOn } from '@/lib/goal-tracking'
import { dateKey } from '@/lib/format'
import type { LifeObject } from '@/lib/types'
import { StaggerList, StaggerItem } from '@/components/shared/stagger-list'

function GoalStepRow({ goal }: { goal: LifeObject }) {
  const logs = useLifeOsStore((s) => s.goalStepLogs)
  const logGoalStep = useLifeOsStore((s) => s.logGoalStep)
  const [note, setNote] = useState('')
  const [open, setOpen] = useState(false)

  const done = hasStepOn(logs, goal.id, dateKey())
  const streak = goalStreak(logs, goal.id)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    logGoalStep(goal.id, note)
    setNote('')
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-rose-400">
          <Target className="size-4" />
        </div>
        <Link to={`/object/${goal.id}`} className="flex-1 truncate text-sm font-medium hover:text-accent">
          {goal.title}
        </Link>
        {streak > 0 ? (
          <span className="flex items-center gap-1 text-xs font-medium text-warning">
            <Flame className="size-3.5" />
            {streak}
          </span>
        ) : null}
        {done ? (
          <Badge variant="accent">
            <Check className="size-3" />
            Step logged
          </Badge>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
            Log step
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && !done ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's today's small step?"
              autoFocus
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="accent">
              Add
            </Button>
          </motion.form>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function GoalSteps() {
  const objects = useLifeOsStore((s) => s.lifeObjects)
  const logs = useLifeOsStore((s) => s.goalStepLogs)
  const goals = activeGoals(objects)
  const missed = goalsMissedYesterday(goals, logs)

  if (goals.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        Set a goal to start tracking small daily steps toward it.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {missed.length > 0 ? (
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            No step logged yesterday for {missed.map((g) => g.title).join(', ')}. Even a small step keeps it
            moving — log one today.
          </p>
        </div>
      ) : null}

      <StaggerList className="flex flex-col gap-2">
        {goals.map((goal) => (
          <StaggerItem key={goal.id}>
            <GoalStepRow goal={goal} />
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  )
}
