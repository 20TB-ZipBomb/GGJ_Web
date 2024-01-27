<script lang="ts">
	import BigText from '$lib/components/big-text.svelte';
	import JobForm from '$lib/components/job-form.svelte';
	import JobList from '$lib/components/job-list.svelte';
	import MyNameIs from '$lib/components/my-name-is.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import { ClientState, JobbersWebClient } from '$lib/websocket-client';
	import { onMount } from 'svelte';

	let name: string = '';
	let roomCode: string = '';
	let serverAddress: string = '';

	let buttonDisabled: boolean = false;
	$: buttonDisabled = name.length === 0 || roomCode.length === 0 || serverAddress.length === 0;

	let clientState: ClientState = ClientState.MENU;

	let jobberClient: JobbersWebClient;

	function joinGame(): void {
		clientState = ClientState.CONNECTING;
		jobberClient = new JobbersWebClient(serverAddress);
		jobberClient.onOpen = () => {
			console.log('connected');
			// jobberClient.sendJoinGame(roomCode, name);
		};
		jobberClient.onGameStateChanged = (oldGameState: ClientState, newGameState: ClientState) => {
			clientState = newGameState;
		};
		jobberClient.onError = () => {
			clientState = ClientState.MENU;
		};
	}

	onMount(() => {
		console.log('mounted');
	});
</script>

{#if clientState == ClientState.MENU}
	<BigText text="Jobbers" />
	<MyNameIs bind:name />
	<h2>Room Code</h2>
	<input type="text" bind:value={roomCode} />
	<h2>Server WebSocket Address</h2>
	<input type="text" bind:value={serverAddress} />
	<StylizedButton disabled={buttonDisabled} text="Join Game" on:click={joinGame} />
{:else if clientState == ClientState.CONNECTING}
	<Spinner message="Connecting" />
{:else if clientState == ClientState.LOBBY}
	<Spinner message="Waiting for the game to begin" />
{:else if clientState == ClientState.JOB_CREATION}
	<JobForm
		on:jobSubmited={(e) => {
			jobberClient.createJob(e.detail.title);
		}}
	/>
{:else if clientState == ClientState.JOB_CREATION_DONE}
	<Spinner message="Waiting for others to make jobs" />
{:else if clientState == ClientState.JOB_PICKING}
	<JobList
		jobs={jobberClient.cards}
		on:jobSelected={(e) => {
			jobberClient.sendCardData(e.detail.jobId);
		}}
	/>
{:else if clientState == ClientState.JOB_PICKING_DONE}
	<Spinner message="Waiting for others to pick jobs" />
{/if}
