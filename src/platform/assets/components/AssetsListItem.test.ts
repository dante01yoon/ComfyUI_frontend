import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AssetsListItem from './AssetsListItem.vue'

describe('AssetsListItem', () => {
  it('shows a darkened play overlay for video previews', () => {
    const wrapper = mount(AssetsListItem, {
      props: {
        previewUrl: 'https://example.com/preview.jpg',
        previewAlt: 'clip.mp4',
        isVideoPreview: true
      }
    })

    expect(wrapper.find('img').attributes('src')).toBe(
      'https://example.com/preview.jpg'
    )
    expect(wrapper.find('.bg-black\\/10').exists()).toBe(true)
    expect(wrapper.find('.icon-\\[lucide--play\\]').exists()).toBe(true)
  })

  it('does not show play overlay for non-video previews', () => {
    const wrapper = mount(AssetsListItem, {
      props: {
        previewUrl: 'https://example.com/preview.jpg',
        previewAlt: 'image.png',
        isVideoPreview: false
      }
    })

    expect(wrapper.find('.icon-\\[lucide--play\\]').exists()).toBe(false)
  })
})
