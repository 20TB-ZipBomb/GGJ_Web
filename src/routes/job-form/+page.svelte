<script lang="ts">
	import BigText from '$lib/components/big-text.svelte';
	import JobForm from '$lib/components/job-form.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';

	let jobTextInput: HTMLInputElement;
	let jobTextInputText: string = '';
</script>

<BigText text="Create a job title" />
<JobForm bind:input={jobTextInput} bind:text={jobTextInputText} />
<StylizedButton
	disabled={jobTextInputText.length === 0}
	text="Submit"
	on:click={() => {
		jobTextInputText = '';
		jobTextInput.focus();
	}}
/>
