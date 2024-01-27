<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Job from './job.svelte';
	import type { Card } from '$lib/websocket-client';

	export let jobs: Card[] = [];
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
	{#each jobs as { job_text }, job}
		<Job title={job_text} isSelected={currentSelection == job_text} on:jobSelected={onJobSelect} />
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}
</style>
