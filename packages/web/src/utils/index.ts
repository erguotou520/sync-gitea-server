import { removeToken } from '@/api'
import { AppRoutes } from '@/constants'

export function onExpired() {
  removeToken()
  window.location.href = `#/${AppRoutes.Login}`
}

export function copy(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
}
