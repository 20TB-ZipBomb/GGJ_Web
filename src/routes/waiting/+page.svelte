<script>
	import { goto } from '$app/navigation';
	import Spinner from '$lib/components/spinner.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			goto('job-form');
		}, 300);
	});
</script>

<Spinner />
