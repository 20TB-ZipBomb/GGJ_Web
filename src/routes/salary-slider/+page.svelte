<script>
	import SalarySlider from '$lib/components/salary-slider.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';

	let salaryCents = 1;
</script>

<SalarySlider bind:salaryCents />
<StylizedButton text="Confirm" />

<style>
	h1 {
		font-family: 'Belgrano';
		text-align: center;
	}
</style>
