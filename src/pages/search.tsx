import { SearchView } from '@/components/search/search-view'

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-sm text-muted-foreground">Find anything you've captured.</p>
      </header>
      <SearchView />
    </div>
  )
}
