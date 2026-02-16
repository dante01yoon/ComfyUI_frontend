import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { AssetMeta } from '../schemas/mediaAssetSchema'
import MediaVideoTop from './MediaVideoTop.vue'

const createVideoAsset = (src: string): AssetMeta => ({
  id: 'video-1',
  name: 'clip.mp4',
  asset_hash: null,
  mime_type: 'video/mp4',
  tags: [],
  kind: 'video',
  src
})

describe('MediaVideoTop', () => {
  it('renders playable video with darkened paused overlay and play icon', () => {
    const wrapper = mount(MediaVideoTop, {
      props: {
        asset: createVideoAsset('https://example.com/thumb.jpg')
      }
    })

    expect(wrapper.find('video').exists()).toBe(true)
    expect(wrapper.find('source').attributes('src')).toBe(
      'https://example.com/thumb.jpg'
    )
    expect(wrapper.find('.bg-black\\/10').exists()).toBe(true)
    expect(wrapper.find('.icon-\\[lucide--play\\]').exists()).toBe(true)
  })

  it('emits playback events and hides paused overlay while playing', async () => {
    const wrapper = mount(MediaVideoTop, {
      props: {
        asset: createVideoAsset('https://example.com/thumb.jpg')
      }
    })

    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)

    await video.trigger('play')
    expect(wrapper.emitted('videoPlayingStateChanged')?.at(-1)).toEqual([true])
    expect(wrapper.find('.bg-black\\/10').exists()).toBe(false)

    await video.trigger('pause')
    expect(wrapper.emitted('videoPlayingStateChanged')?.at(-1)).toEqual([false])
    expect(wrapper.find('.bg-black\\/10').exists()).toBe(true)
  })
})
