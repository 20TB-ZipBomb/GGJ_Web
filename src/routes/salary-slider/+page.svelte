<script>
	import SalarySlider from '$lib/components/salary-slider.svelte';
	import StylizedButton from '$lib/components/stylized-button.svelte';

	let userToJudge = 'Dan';
	let jobTitle = 'Plumber';
</script>

<h1>Based their experience, award {userToJudge} a salary for a {jobTitle}</h1>
<SalarySlider
	on:salaryChanged={(e) => {
		console.log(e.detail.salary);
	}}
/>
<StylizedButton text="Confirm" />

<style>
	h1 {
		text-align: center;
	}
</style>
