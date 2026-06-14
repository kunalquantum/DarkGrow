export type MoodLevel = {
  value: number
  emoji: string
  label: string
  color: string
}

/** 1 (awful) to 5 (great) mood scale, used by the daily reflection slider. */
export const MOOD_SCALE: MoodLevel[] = [
  { value: 1, emoji: '😞', label: 'Awful', color: '#f87171' },
  { value: 2, emoji: '😕', label: 'Low', color: '#fb923c' },
  { value: 3, emoji: '😐', label: 'Okay', color: '#fbbf24' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#34d399' },
  { value: 5, emoji: '😄', label: 'Great', color: '#22d3ee' },
]

export const DEFAULT_MOOD = 3

export function moodForValue(value: number): MoodLevel {
  return MOOD_SCALE.find((level) => level.value === value) ?? MOOD_SCALE[DEFAULT_MOOD - 1]
}

export type EmotionTag = {
  id: string
  label: string
  emoji: string
}

/** Selectable emotion tags for the daily reflection. */
export const EMOTION_TAGS: EmotionTag[] = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'proud', label: 'Proud', emoji: '😎' },
  { id: 'motivated', label: 'Motivated', emoji: '🔥' },
  { id: 'loved', label: 'Loved', emoji: '🥰' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌱' },
  { id: 'tired', label: 'Tired', emoji: '🥱' },
  { id: 'bored', label: 'Bored', emoji: '😴' },
  { id: 'anxious', label: 'Anxious', emoji: '😬' },
  { id: 'stressed', label: 'Stressed', emoji: '😣' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🤯' },
  { id: 'lonely', label: 'Lonely', emoji: '🥺' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
]
