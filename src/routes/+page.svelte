<script lang="ts">
	import BigText from '$lib/components/big-text.svelte';
	import JobForm from '$lib/components/job-form.svelte';
	import JobList from '$lib/components/job-list.svelte';
	import Job from '$lib/components/job.svelte';
	import MyNameIs from '$lib/components/my-name-is.svelte';
	import SalarySlider from '$lib/components/salary-slider.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import { ClientState, JobbersWebClient, type Card } from '$lib/websocket-client';

	let jobberClient: JobbersWebClient;
	let clientState: ClientState = ClientState.MENU;

	// Menu related
	let name: string = '';
	let roomCode: string = '';
	let serverAddress: string = '';
	let menuButtonDisabled: boolean = false;
	$: menuButtonDisabled = name.length === 0 || roomCode.length === 0 || serverAddress.length === 0;

	// Gameplay related
	let jobTextInput: HTMLInputElement;
	let jobTextInputText: string = '';
	let createdJobTexts: string[] = [];
	let selectedJob: Card | null = null;
	let salaryCents: number = 1;

	function joinGame(): void {
		// Reset gameplay related variables
		createdJobTexts = [];
		jobTextInputText = '';
		selectedJob = null;
		salaryCents = 1;

		clientState = ClientState.CONNECTING;
		jobberClient = new JobbersWebClient(serverAddress, roomCode, name);
		jobberClient.onGameStateChanged = (oldGameState: ClientState, newGameState: ClientState) => {
			clientState = newGameState;
		};
		jobberClient.onError = () => {
			clientState = ClientState.MENU;
		};
	}
</script>

{#if clientState == ClientState.MENU}
	<BigText text="Octopations" fontSize="4em" />
	<MyNameIs bind:name bind:roomCode />
	<h2 style="margin: 0">Server WebSocket Address</h2>
	<input type="text" bind:value={serverAddress} />
	<StylizedButton disabled={menuButtonDisabled} text="Join Game" on:click={joinGame} />
{:else if clientState == ClientState.CONNECTING}
	<Spinner message="Connecting" />
{:else if clientState == ClientState.LOBBY}
	<Spinner message="Waiting for the game to begin" />
{:else if clientState == ClientState.JOB_CREATION}
	<BigText text="Enter a Job Title" />
	<JobForm bind:input={jobTextInput} bind:text={jobTextInputText} />
	<StylizedButton
		disabled={jobTextInputText.length === 0 ||
			createdJobTexts.includes(jobTextInputText.toUpperCase())}
		text="Submit"
		on:click={() => {
			jobTextInput.focus();
			jobberClient.createJob(jobTextInputText);
			createdJobTexts.push(jobTextInputText.toUpperCase());
			jobTextInputText = '';
		}}
	/>
{:else if clientState == ClientState.JOB_CREATION_DONE}
	<Spinner message="Waiting for others to make jobs" />
{:else if clientState == ClientState.JOB_PICKING}
	<BigText text="Interviewing for" />
	<Job title={jobberClient.jobCard.job_text} />
	<BigText text="Choose your qualification" />
	<JobList jobs={jobberClient.cards} bind:selectedJob />
	<StylizedButton
		text={selectedJob ? 'Pick a job' : 'Confirm'}
		disabled={selectedJob == null}
		on:click={() => {
			if (selectedJob == null) return;
			jobberClient.sendCardData(selectedJob.card_id);
			selectedJob = null;
		}}
	/>
{:else if clientState == ClientState.JOB_PICKING_DONE}
	<Spinner message="Waiting for others to pick jobs" />
{:else if clientState == ClientState.INTERVIEWEE}
	<BigText text="You are being interviewed" />
{:else if clientState == ClientState.INTERVIEWER}
	<BigText text="Send past experience" />
	<JobList jobs={jobberClient.cards} bind:selectedJob />
	<StylizedButton
		text={selectedJob ? 'Select a job to send' : 'Send job'}
		disabled={selectedJob == null}
		on:click={() => {
			if (selectedJob == null) return;
			jobberClient.sendCardData(selectedJob.card_id);
			selectedJob = null;
		}}
	/>
{:else if clientState == ClientState.VOTING}
	<SalarySlider bind:salaryCents />
	<StylizedButton
		text="Confirm"
		on:click={() => {
			jobberClient.sendScoreSubmission(salaryCents);
		}}
	/>
{:else if clientState == ClientState.VOTING_DONE}
	<Spinner message="Waiting for others to vote" />
{/if}
