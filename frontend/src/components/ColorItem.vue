<template>
  <span
    class="color-item"
    :class="{active: isActive, 'no-color': !color}"
    :style="{background: color}"
  >
    <q-tooltip v-if="name">{{ name }}</q-tooltip>
  </span>
</template>

<script>
export default {
  name: 'ColorItem',
  props: {
    color: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.color-item {
  display: inline-block;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  border: 5px solid transparent;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
  }

  &:active,&.active {
    border-color: rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: scale(0.9);
  }

  &.no-color {
    background: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 5px,
        #ccc 5px,
        #ccc 10px
    );
  }
}
</style>
