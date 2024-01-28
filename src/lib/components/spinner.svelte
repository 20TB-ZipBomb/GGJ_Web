<script>
	import { SyncLoader } from 'svelte-loading-spinners';

	export let message = 'Waiting';
</script>

<div class="waiting-container">
	<h1>{message}</h1>
	<div class="spinner-wrapper"><SyncLoader /></div>
</div>

<style>
	.waiting-container {
		display: flex;
	}

	h1 {
		display: inline;
		align-self: end;
		font-size: 4em;
	}
	.spinner-wrapper {
		display: inline;
		align-self: end;
		padding-bottom: 2.5em;
	}
</style>
