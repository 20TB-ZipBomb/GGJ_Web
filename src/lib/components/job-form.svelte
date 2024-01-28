<script lang="ts">
	export let text = '';
	export let input: HTMLElement;
</script>

<input
	on:keydown
	type="text"
	placeholder="Lawyer, Pirate, etc."
	bind:value={text}
	bind:this={input}
/>

<style>
	input {
		width: min(100%, 400px);
		font-size: 1.8em;
		border: none;
		text-align: center;
		margin-bottom: 10px;
		margin-top: 10px;
		height: 100px;
		font-weight: bold;
		border-radius: 4px;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, 1);
	}
</style>
