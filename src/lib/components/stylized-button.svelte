<script lang="ts">
	export let text: String = '';
</script>

<button on:click>{text}</button>

<style>
	/* Remove built in button styling */
	button {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
