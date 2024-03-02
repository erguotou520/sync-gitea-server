import { getInfo } from '@/api'
import { create } from 'zustand'

export type InfoState = {
  ready: boolean
  info: { publicUrl: string }
  init: () => Promise<void>
}

export const useInfo = create<InfoState>((set, get) => ({
  ready: false,
  info: { publicUrl: location.origin },
  async init() {
    if (get().ready) {
      return
    }
    const { data } = await getInfo()
    if (data?.publicUrl) {
      set({
        info: data
      })
    }
    set({ ready: true })
  }
}))
