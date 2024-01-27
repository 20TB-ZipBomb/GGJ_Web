<script>
	import JobList from '$lib/components/job-list.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	let job = '';
</script>

<JobList
	jobs={[
		{ title: 'Fisher' },
		{ title: 'Lawyer' },
		{ title: 'Mechanic' },
		{ title: 'Dark overlord' }
	]}
	on:jobSelected={(e) => {
		job = e.detail.title;
	}}
/>
<StylizedButton text={job && job.length ? `Confirm ${job}` : 'Pick a job'} />
