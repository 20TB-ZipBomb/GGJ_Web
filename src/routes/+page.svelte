<script lang="ts">
	import { goto } from '$app/navigation';
	import BigText from '$lib/components/big-text.svelte';
	import MyNameIs from '$lib/components/my-name-is.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
</script>

<BigText text="Jobbers" />
<MyNameIs />
<h2>Room Code</h2>

<StylizedButton text="Join Game"/>
