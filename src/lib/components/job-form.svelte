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
	disabled={text.length === 0}
	text="Submit"
	on:click={() => {
		submitJobTitle();
		text = '';
		input.focus();
	}}
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
