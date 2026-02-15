<template>
  <div
    ref="container"
    class="flex h-7 rounded-lg bg-component-node-widget-background text-xs text-component-node-foreground"
  >
    <Button
      class="h-full w-8 rounded-r-none hover:bg-base-foreground/20 disabled:opacity-30"
      variant="muted-textonly"
      :disabled="!canDecrement"
      tabindex="-1"
      @click="modelValue = clamp(modelValue - step)"
    >
      <i class="pi pi-minus" />
    </Button>
    <div class="relative min-w-[4ch] flex-1 py-1.5 my-0.25">
      <input
        ref="inputField"
        type="number"
        :min
        :max
        :step
        :value="modelValue"
        class="absolute inset-0 border-0 bg-transparent p-1 text-xs focus:outline-0"
        inputmode="decimal"
        autocomplete="off"
        @blur="handleBlur"
        @keyup.enter="handleBlur"
        @dragstart.prevent
      />
      <div
        :class="
          cn(
            'absolute inset-0 z-10 cursor-ew-resize',
            textEdit && 'pointer-events-none hidden'
          )
        "
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="resetDrag"
      />
    </div>
    <Button
      class="h-full w-8 rounded-l-none hover:bg-base-foreground/20 disabled:opacity-30"
      variant="muted-textonly"
      :disabled="!canIncrement"
      tabindex="-1"
      @click="modelValue = clamp(modelValue + step)"
    >
      <i class="pi pi-plus" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'

import Button from '@/components/ui/button/Button.vue'
import { cn } from '@/utils/tailwindUtil'

const {
  min,
  max,
  step = 1
} = defineProps<{
  min?: number
  max?: number
  step?: number
}>()

const modelValue = defineModel<number>({ default: 0 })

const container = useTemplateRef<HTMLDivElement>('container')
const inputField = useTemplateRef<HTMLInputElement>('inputField')
const textEdit = ref(false)

onClickOutside(container, () => {
  if (textEdit.value) textEdit.value = false
})

const canDecrement = computed(() => modelValue.value > (min ?? -Infinity))
const canIncrement = computed(() => modelValue.value < (max ?? Infinity))

const dragging = ref(false)
const dragDelta = ref(0)

function clamp(value: number): number {
  const lo = min ?? -Infinity
  const hi = max ?? Infinity
  return Math.min(hi, Math.max(lo, value))
}

function handleBlur(e: Event) {
  const target = e.target as HTMLInputElement
  const parsed = Number(target.value)
  if (!isNaN(parsed)) {
    modelValue.value = clamp(parsed)
  } else {
    target.value = String(modelValue.value)
  }
  textEdit.value = false
}

function handlePointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  const target = e.target as HTMLElement
  target.setPointerCapture(e.pointerId)
  dragging.value = true
  dragDelta.value = 0
}

function handlePointerMove(e: PointerEvent) {
  if (!dragging.value) return
  dragDelta.value += e.movementX
  const steps = (dragDelta.value / 10) | 0
  if (steps === 0) return
  const unclipped = modelValue.value + steps * step
  dragDelta.value %= 10
  modelValue.value = clamp(unclipped)
}

function handlePointerUp() {
  if (!dragging.value) return

  if (dragDelta.value === 0) {
    textEdit.value = true
    inputField.value?.focus()
    inputField.value?.select()
  }

  resetDrag()
}

function resetDrag() {
  dragging.value = false
  dragDelta.value = 0
}
</script>
