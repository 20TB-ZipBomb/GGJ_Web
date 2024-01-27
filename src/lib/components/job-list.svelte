<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Job from './job.svelte';

	export let jobs: any;
	export let height = '80%';

	let currentSelection = '';

	const dispatch = createEventDispatcher();
	function onJobSelect(e: any) {
		currentSelection = e.detail.title;
		dispatch('jobSelected', {
			title: currentSelection
		});
	}
</script>

<div style={`height: ${height};`}>
	{#each jobs as { title }, job}
		<Job {title} isSelected={currentSelection == title} on:jobSelected={onJobSelect} />
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}
</style>
