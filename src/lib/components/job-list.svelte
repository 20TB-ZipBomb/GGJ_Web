<script lang="ts">
	import Job from './job.svelte';
	import type { Card } from '$lib/websocket-client';

	export let jobs: Card[] = [];
	export let selectedJob: Card | null = null;
</script>

<div>
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
		align-items: center;
		overflow-y: scroll;
		gap: 20px;
		width: min(80%, 400px);
		max-height: calc(100vh - 400px);
		border: 1px solid rgb(35, 35, 35);
		background-color: rgba(0, 0, 0, 0.317);
		border-radius: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
	}
</style>
