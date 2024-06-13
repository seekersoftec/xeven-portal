import { FC, useState } from 'react'
import { ButtonStyle } from './styled'

interface TickButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>, enabled: boolean) => void
  message: string
  disabled?: boolean
}

const TickButton: FC<TickButtonProps> = ({ onClick, message, disabled }) => {
  const [enabled, setEnabled] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newEnabledState = !enabled
    setEnabled(newEnabledState)
    onClick?.(event, newEnabledState)
  }

  return (
    <ButtonStyle onClick={handleClick} disabled={disabled}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
      {enabled ? <span>{message} Enabled</span> : <span>{message} Disabled</span>}
    </ButtonStyle>
  )
}

export default TickButton
