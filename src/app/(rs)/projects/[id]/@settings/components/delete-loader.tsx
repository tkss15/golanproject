import { Trash2 } from "lucide-react"

export function DeleteLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <Trash2 className="h-12 w-12 text-muted-foreground animate-bounce" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">Deleting project...</p>
      <div className="mt-2 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

