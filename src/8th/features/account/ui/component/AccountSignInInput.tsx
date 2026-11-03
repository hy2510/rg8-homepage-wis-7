export default function AccountSignInInput({
  ref,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  autoComplete,
  ariaLabel,
  action,
}: {
  ref?: React.RefObject<HTMLInputElement | null>
  type?: React.HTMLInputTypeAttribute
  value?: string
  onChange?: (text: string) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
  ariaLabel?: string
  action?: {
    disabled?: boolean
    onClick: () => void
    ariaLabel: string
  }
}) {
  return (
    <label className="group-enter-field">
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value)
          }
        }}
        onKeyDown={(event) => {
          if (onKeyDown) {
            onKeyDown(event)
          }
        }}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
      />
      {action && <ActionButton {...action} />}
    </label>
  )
}

function ActionButton({
  disabled = false,
  onClick,
  ariaLabel,
}: {
  disabled?: boolean
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      className={`add-go${!disabled ? ' is-ready' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true">
        <path
          d="M5 12H19"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
