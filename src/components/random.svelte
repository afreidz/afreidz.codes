<script lang="ts">
  let words: string[] = [];
  let classList: string = "";
  export { words, classList as class };
</script>

<span class={classList}>{words[Math.floor(Math.random() * words.length)]}</span>
