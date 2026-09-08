import { useEffect, useId, useRef } from 'react'

import { copy } from '../content/copy.ts'
import { toBlocks } from '../utils/richText.tsx'

type TextDialogProps = {
  eyebrow?: string
  title: string
  content: string
  open: boolean
  onDismiss: () => void
}

function TextDialog({ eyebrow, title, content, open, onDismiss }: TextDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      titleRef.current?.focus({ preventScroll: true })
      dialog.scrollTop = 0
    }

    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="study-modal text-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
      }}
    >
      {eyebrow ? <p className="study-modal__eyebrow">{eyebrow}</p> : null}

      <h2 id={titleId} className="study-modal__title" ref={titleRef} tabIndex={-1}>
        {title}
      </h2>

      <div className="text-dialog__content">{toBlocks(content)}</div>

      <div className="study-modal__actions">
        <button type="button" className="start-button" onClick={onDismiss}>
          {copy.actions.continue}
        </button>
      </div>
    </dialog>
  )
}

export default TextDialog
