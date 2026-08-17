'use client'

// Wraps the submit button of a `<form action={deleteDocument}>` with a
// native confirm() dialog. The surrounding form/Server Action stays
// server-side; this is the one bit that has to run in the browser.
export function DeleteButton({ className }: { className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm('Delete this document? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      Delete
    </button>
  )
}
