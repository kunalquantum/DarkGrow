import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLifeOsStore } from '@/store/lifeOsStore'
import { DEFAULT_MOOD } from '@/lib/mood-meta'
import { MoodSlider } from '@/components/home/mood-slider'
import { EmotionTags } from '@/components/home/emotion-tags'

export function DailyReflection() {
  const reflection = useLifeOsStore((s) => s.dailyReflections.find((r) => r.date === new Date().toISOString().slice(0, 10)))
  const saveTodaysReflection = useLifeOsStore((s) => s.saveTodaysReflection)

  const [mood, setMood] = useState(DEFAULT_MOOD)
  const [emotions, setEmotions] = useState<string[]>([])
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
    setHighlight(reflection?.highlight ?? '')
    setLowlight(reflection?.lowlight ?? '')
    setGratitude(reflection?.gratitude ?? '')
    setNotes(reflection?.notes ?? '')
  }

  function toggleEmotion(id: string) {
    setEmotions((current) => (current.includes(id) ? current.filter((e) => e !== id) : [...current, id]))
  }

  function handleSave() {
    saveTodaysReflection({ mood, emotions, highlight, lowlight, gratitude, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="flex flex-col gap-3">
      <MoodSlider value={mood} onChange={setMood} />

      <div className="flex flex-col gap-1.5">
        <Label>How are you feeling?</Label>
        <EmotionTags value={emotions} onToggle={toggleEmotion} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="highlight">Highlight of the day</Label>
        <Textarea
          id="highlight"
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
          placeholder="What went well?"
          className="min-h-16"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lowlight">Lowlight of the day</Label>
        <Textarea
          id="lowlight"
          value={lowlight}
          onChange={(e) => setLowlight(e.target.value)}
          placeholder="What was difficult?"
          className="min-h-16"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="gratitude">Grateful for</Label>
        <Textarea
          id="gratitude"
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="What are you grateful for?"
          className="min-h-16"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else on your mind?"
          className="min-h-16"
        />
      </div>
      <Button onClick={handleSave} variant="accent" className="self-start">
        {saved ? <Check className="size-4" /> : null}
        {saved ? 'Saved' : 'Save reflection'}
      </Button>
    </div>
  )
}
