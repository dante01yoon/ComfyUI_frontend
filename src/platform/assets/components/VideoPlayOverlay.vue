<template>
  <template v-if="visible">
    <div :class="cn('pointer-events-none absolute inset-0', overlayClass)" />
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        :class="
          cn(
            'flex items-center justify-center rounded-full bg-black/60',
            buttonSizeClass
          )
        "
      >
        <i
          aria-hidden="true"
          :class="cn('icon-[lucide--play] text-white', iconSizeClass)"
        />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/utils/tailwindUtil'

const {
  visible = true,
  size = 'md',
  overlayClass = 'bg-black/15'
} = defineProps<{
  visible?: boolean
  size?: 'sm' | 'md'
  overlayClass?: string
}>()

const buttonSizeClass = computed(() => (size === 'sm' ? 'size-5' : 'size-12'))
const iconSizeClass = computed(() => (size === 'sm' ? 'size-3' : 'size-6'))
</script>
