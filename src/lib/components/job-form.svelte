<script lang="ts">
	import StylizedButton from './stylized-button.svelte';
	import BigText from './big-text.svelte';
	import { createEventDispatcher } from 'svelte';

	let text = '';
	let input: HTMLElement;

	const dispatch = createEventDispatcher();
	function submitJobTitle() {
		dispatch('jobSubmited', {
			title: text
		});
	}
</script>

<BigText text="Enter a Job Title" />

<input type="text" placeholder="Lawyer, Pirate, etc." bind:value={text} bind:this={input} />
<StylizedButton
	text="Submit"
	on:click={() => {
		submitJobTitle();
		text = '';
		input.focus();
	}}
/>

<style>
	input {
		width: calc(100% - 20px);
		font-size: 2em;
		border: none;
		margin-left: 10px;
		text-align: center;
		margin-bottom: 10px;
		margin-top: 10px;
		height: 100px;
		font-weight: bold;
		border-radius: 4px;
	}
</style>
