<script lang="ts">
	import BigText from '$lib/components/big-text.svelte';
	import JobList from '$lib/components/job-list.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import type { Card } from '$lib/websocket-client';
	let jobs: Card[] = [
		{
			card_id: '1',
			job_text: 'Fisher'
		},
		{
			card_id: '2',
			job_text: 'Lawyer'
		},
		{
			card_id: '3',
			job_text: 'Mechanic'
		},
		{
			card_id: '4',
			job_text: 'Dark overlord'
		},
		{
			card_id: '5',
			job_text: 'Software Engineer'
		}
	];

	let selectedJob: Card | null = null;
</script>

<BigText text="Pick a job" />
<JobList bind:selectedJob {jobs} />
<StylizedButton disabled={selectedJob == null} text={selectedJob ? `Confirm` : 'Pick a job'} />
