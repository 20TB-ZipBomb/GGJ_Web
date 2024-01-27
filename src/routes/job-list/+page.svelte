<script lang="ts">
	import JobList from '$lib/components/job-list.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import type { Card } from '$lib/websocket-client';
	let jobs: Card[] = [
		{
			card_id: 1,
			job_text: 'Fisher'
		},
		{
			card_id: 2,
			job_text: 'Lawyer'
		},
		{
			card_id: 3,
			job_text: 'Mechanic'
		},
		{
			card_id: 4,
			job_text: 'Dark overlord'
		}
	];

	let selectedJob: Card | null = null;
</script>

<JobList bind:selectedJob {jobs} />
<StylizedButton
	disabled={selectedJob == null}
	text={selectedJob ? `Confirm ${selectedJob.job_text}` : 'Pick a job'}
/>
