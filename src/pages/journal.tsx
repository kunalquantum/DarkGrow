import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { DEFAULT_MOOD, moodForValue } from '@/lib/mood-meta'
import { DEFAULT_LIFE_PATTERN, type LifePatternDimension, type LifePatternType } from '@/lib/types'
import { MoodSlider } from '@/components/home/mood-slider'
import { EmotionTags } from '@/components/home/emotion-tags'
import { LifePattern } from '@/components/home/life-pattern'

function JournalField({
  label,
  prompt,
  value,
  onChange,
}: {
  label: string
  prompt: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={prompt}
        className="min-h-32 resize-none border-0 bg-transparent p-0 font-journal text-2xl leading-8 text-stone-800 shadow-none outline-none placeholder:text-stone-400 focus-visible:ring-0"
      />
    </div>
  )
}

export default function JournalPage() {
  const navigate = useNavigate()
  const reflection = useLifeOsStore((s) => s.dailyReflections.find((r) => r.date === new Date().toISOString().slice(0, 10)))
  const saveTodaysReflection = useLifeOsStore((s) => s.saveTodaysReflection)

  const [mood, setMood] = useState(DEFAULT_MOOD)
  const [emotions, setEmotions] = useState<string[]>([])
  const [lifePattern, setLifePattern] = useState<LifePatternType>(DEFAULT_LIFE_PATTERN)
  const [patternScores, setPatternScores] = useState<Partial<Record<LifePatternDimension, number>>>({})
  const [highlight, setHighlight] = useState('')
  const [lowlight, setLowlight] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  // Load the persisted reflection into local state once, the first time it becomes available.
  const [loadedId, setLoadedId] = useState<string | null>(null)
  const reflectionId = reflection?.id ?? null
  if (reflectionId !== null && loadedId !== reflectionId) {
    setLoadedId(reflectionId)
    setMood(reflection?.mood ?? DEFAULT_MOOD)
    setEmotions(reflection?.emotions ?? [])
    setLifePattern(reflection?.lifePattern ?? DEFAULT_LIFE_PATTERN)
    setPatternScores(reflection?.patternScores ?? {})
    setHighlight(reflection?.highlight ?? '')
    setLowlight(reflection?.lowlight ?? '')
    setGratitude(reflection?.gratitude ?? '')
    setNotes(reflection?.notes ?? '')
  }

  function toggleEmotion(id: string) {
    setEmotions((current) => (current.includes(id) ? current.filter((e) => e !== id) : [...current, id]))
  }

  function setPatternScore(dimension: LifePatternDimension, value: number) {
    setPatternScores((current) => ({ ...current, [dimension]: value }))
  }

  function handleSave() {
    saveTodaysReflection({ mood, emotions, lifePattern, patternScores, highlight, lowlight, gratitude, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const moodMeta = moodForValue(mood)

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Journal</h1>
          <p className="text-sm text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
      </header>

      <div className="paper flex flex-col gap-5 rounded-2xl border border-border/40 p-5 shadow-xl shadow-black/30">
        <div>
          <p className="font-journal text-4xl leading-tight">{format(new Date(), 'EEEE, MMMM d')}</p>
          <p className="font-journal text-xl italic text-stone-500">
            Dear diary, today felt {moodMeta.emoji} {moodMeta.label.toLowerCase()}...
          </p>
        </div>

        <JournalField label="Highlight of the day" prompt="What went well?" value={highlight} onChange={setHighlight} />
        <JournalField label="Lowlight of the day" prompt="What was difficult?" value={lowlight} onChange={setLowlight} />
        <JournalField label="Grateful for" prompt="What are you grateful for?" value={gratitude} onChange={setGratitude} />
        <JournalField label="Notes" prompt="Anything else on your mind?" value={notes} onChange={setNotes} />
      </div>

      <MoodSlider value={mood} onChange={setMood} />

      <div className="flex flex-col gap-1.5">
        <Label>How are you feeling?</Label>
        <EmotionTags value={emotions} onToggle={toggleEmotion} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Life pattern</Label>
        <LifePattern
          pattern={lifePattern}
          onPatternChange={setLifePattern}
          scores={patternScores}
          onScoreChange={setPatternScore}
        />
      </div>

      <Button onClick={handleSave} variant="accent" className="self-start">
        {saved ? <Check className="size-4" /> : null}
        {saved ? 'Saved' : 'Save entry'}
      </Button>
    </div>
  )
}
