<script lang="ts">
	import BigText from '$lib/components/big-text.svelte';
	import FlexContainer from '$lib/components/flex-container.svelte';
	import JobForm from '$lib/components/job-form.svelte';
	import JobList from '$lib/components/job-list.svelte';
	import MyNameIs from '$lib/components/my-name-is.svelte';
	import SalarySlider from '$lib/components/salary-slider.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';
	import { ClientState, JobbersWebClient, type Card } from '$lib/websocket-client';
	import { onMount } from 'svelte';

	let jobberClient: JobbersWebClient;
	let clientState: ClientState = ClientState.MENU;

	// Menu related
	let name: string = '';
	let roomCode: string = (window.location.href == 'https://octopations.netlify.app/') ? '' : '1234';
	let serverAddress: string = (window.location.href == 'https://octopations.netlify.app/') ? 'wss://ggjp-cc95dfe6cb29.herokuapp.com/connect' : 'ws://localhost:4040/connect'; // TODO: Make this a config file
	let menuButtonDisabled: boolean = false;
	$: menuButtonDisabled = name.length === 0 || roomCode.length === 0 || serverAddress.length === 0;

	// Gameplay related
	let jobTextInput: HTMLInputElement;
	let jobTextInputText: string = '';
	let createdJobTexts: string[] = [];
	let selectedJob: Card | null = null;
	let salaryCents: number = 1;
	let jobCards: Card[] = [];
	let jobsToMake: number = 0;

	function joinGame(): void {
		// Reset gameplay related variables
		createdJobTexts = [];
		jobTextInputText = '';
		selectedJob = null;
		salaryCents = 1;
		jobCards = [];

		localStorage.setItem('name', name);
		clientState = ClientState.CONNECTING;
		jobberClient = new JobbersWebClient(serverAddress, roomCode, name);
		jobberClient.onGameStateChanged = (newGameState: ClientState) => {
			clientState = newGameState;
			if (newGameState == ClientState.INTERVIEWER) {
				jobCards = jobberClient.cards;
			}
		};
		jobberClient.onGameStarted = (numJobsToMake: number) => {
			jobsToMake = numJobsToMake;
		};
		jobberClient.onError = () => {
			clientState = ClientState.MENU;
		};
	}

	onMount(() => {
		name = localStorage.getItem('name') || '';
	});
</script>

{#if clientState == ClientState.MENU}
	<FlexContainer>
		<BigText text="Octopations" fontSize="4em" />
		<MyNameIs bind:name bind:roomCode />
		<!-- <h2 style="margin: 0">Server WebSocket Address</h2>
		<input type="text" bind:value={serverAddress} /> -->
		<StylizedButton disabled={menuButtonDisabled} text="Join Game" on:click={joinGame} />
	</FlexContainer>
{:else if clientState == ClientState.CONNECTING}
	<FlexContainer>
		<Spinner message="Connecting" />
	</FlexContainer>
{:else if clientState == ClientState.LOBBY}
	<FlexContainer>
		<Spinner message="Waiting for the game to begin" />
	</FlexContainer>
{:else if clientState == ClientState.JOB_CREATION}
	<FlexContainer>
		<BigText text="Create Job Titles" fontSize="4.5em" />
		<BigText text="{createdJobTexts.length + 1} of {jobsToMake}" fontSize="3em" />
		<JobForm
			bind:input={jobTextInput}
			bind:text={jobTextInputText}
			on:keydown={(event) => {
				if (event.key === 'Enter') {
					jobberClient.createJob(jobTextInputText);
					createdJobTexts.push(jobTextInputText.toUpperCase());
					createdJobTexts = createdJobTexts; // Force reactivity
					jobTextInputText = '';
				}
			}}
		/>
		<StylizedButton
			disabled={jobTextInputText.length === 0 ||
				createdJobTexts.includes(jobTextInputText.toUpperCase())}
			text="Submit"
			on:click={() => {
				jobTextInput.focus();
				jobberClient.createJob(jobTextInputText);
				createdJobTexts.push(jobTextInputText.toUpperCase());
				createdJobTexts = createdJobTexts; // Force reactivity
				jobTextInputText = '';
			}}
		/>
	</FlexContainer>
{:else if clientState == ClientState.JOB_CREATION_DONE}
	<FlexContainer>
		<Spinner message="Waiting for others to make jobs" />
	</FlexContainer>
{:else if clientState == ClientState.JOB_PICKING}
	<FlexContainer>
		<BigText text="Interviewing for" fontSize="3em" />
		<h2
			style="
        font-family: 'Belgrano';
        font-size: 3em;
        margin: 0;
    "
		>
			{jobberClient.jobCard.job_text}
		</h2>
		<BigText text="Choose your qualification" fontSize="3em" />
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
	</FlexContainer>
{:else if clientState == ClientState.JOB_PICKING_DONE}
	<FlexContainer>
		<Spinner message="Waiting for others to pick jobs" />
	</FlexContainer>
{:else if clientState == ClientState.INTERVIEWEE}
	<FlexContainer>
		<BigText text="You are being interviewed" fontSize="4em" />
	</FlexContainer>
{:else if clientState == ClientState.INTERVIEWER}
	{#if jobCards.length == 0}
		<FlexContainer>
			<BigText text="You have no job titles left to send!" fontSize="4em" />
		</FlexContainer>
	{:else}
		<FlexContainer>
			<BigText text="Send past experience" fontSize="4em" />
			<JobList jobs={jobCards} bind:selectedJob />
			<StylizedButton
				text={'Send Job Experience'}
				disabled={selectedJob == null}
				on:click={() => {
					if (selectedJob == null) return;
					jobberClient.sendInterceptCardData(selectedJob.card_id);
					jobCards = jobCards.filter((card) => card.card_id != selectedJob?.card_id);
					selectedJob = null;
				}}
			/>
		</FlexContainer>
	{/if}
{:else if clientState == ClientState.VOTING}
	<FlexContainer>
		<BigText text="Award Salary" />
		<SalarySlider bind:salaryCents />
		<StylizedButton
			text="Confirm"
			on:click={() => {
				jobberClient.sendScoreSubmission(salaryCents);
			}}
		/>
	</FlexContainer>
{:else if clientState == ClientState.VOTING_DONE}
	<FlexContainer>
		<Spinner message="Waiting for others to vote" />
	</FlexContainer>
{:else if clientState == ClientState.GAME_FINISHED}
	<FlexContainer>
		<BigText text="All rounds finished. Look up at the screen!" />
	</FlexContainer>
{/if}
