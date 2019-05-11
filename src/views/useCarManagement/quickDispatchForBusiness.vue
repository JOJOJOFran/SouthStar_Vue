<template>
  <Business :is-edit="false"/>
</template>

<script>
  import Business from './components/Business'

  export default {
    name: 'CreateForm',
    components: { Business }
  }
</script>

