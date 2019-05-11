<template>
  <Emergency :is-edit="false"/>
</template>

<script>
  import Emergency from './components/Emergency'

  export default {
    name: 'CreateForm',
    components: { Emergency }
  }
</script>

