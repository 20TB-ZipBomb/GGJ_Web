<script>
	import { SyncLoader } from 'svelte-loading-spinners';
	import BigText from './big-text.svelte';

	export let message = 'Waiting';
</script>

<div class="waiting-container">
	<BigText text={message} fontSize="4em" />
	<SyncLoader />
</div>

<style>
	.waiting-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
