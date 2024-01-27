<script lang="ts">
	import { goto } from '$app/navigation';
	import BigText from '$lib/components/big-text.svelte';
	import MyNameIs from '$lib/components/my-name-is.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import { JobbersWebClient } from '$lib/websocket-client';
	import { onMount } from 'svelte';

	let name: string = '';
	let roomCode: string = '';
	let serverAddress: string = '';

	let buttonDisabled: boolean = false;
	$: buttonDisabled = name.length === 0 || roomCode.length === 0 || serverAddress.length === 0;

	let jobberClient: JobbersWebClient;

	function joinGame(): void {
		jobberClient = new JobbersWebClient(serverAddress);
		//test
	}

	onMount(() => {
		console.log('mounted');
	});
</script>

<BigText text="Jobbers" />
<MyNameIs bind:name />
<h2>Room Code</h2>
<input type="text" bind:value={roomCode} />
<h2>Server WebSocket Address</h2>
<input type="text" bind:value={serverAddress} />
<StylizedButton disabled={buttonDisabled} text="Join Game" on:click={joinGame} />
