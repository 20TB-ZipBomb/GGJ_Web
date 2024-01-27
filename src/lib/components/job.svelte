<script>
	import { createEventDispatcher } from 'svelte';
	export let title = 'Job Title';
	export let isSelected = false;

	const dispatch = createEventDispatcher();
	function select() {
		dispatch('jobSelected', {
			title: title
		});
	}
</script>

<p on:click={select} style={isSelected ? 'border: 2px solid #008000' : ''}>{title}</p>

<style>
	p {
		background-color: white;
		text-align: center;
		font-size: 2em;
		margin: 5%;
		text-align: center;
	}
</style>
