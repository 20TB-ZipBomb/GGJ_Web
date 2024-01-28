<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div in:fade={{ delay: 500, duration: 300 }} out:fade={{ duration: 300 }}>
	<slot />
</div>

<style>
	div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow-y: scroll;
		gap: 20px;
	}
</style>
