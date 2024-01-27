<script lang="ts">
	import Job from './job.svelte';
	import type { Card } from '$lib/websocket-client';

	export let jobs: Card[] = [];
	export let height = '80%';
	export let selectedJob: Card | null = null;
</script>

<div style={`height: ${height};`}>
	{#each jobs as job}
		<Job
			title={job.job_text}
			isSelected={selectedJob?.job_text == job.job_text}
			on:click={() => {
				selectedJob = job;
			}}
		/>
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}
</style>
