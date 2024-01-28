<script lang="ts">
	import { spring } from 'svelte/motion';
	import BigText from './big-text.svelte';
	export let salaryCents: number = 1;
	const MAX_SALARY = 10000000;

	// create a springy number formatter
	let springySalaryCents = spring(salaryCents, {
		stiffness: 0.3,
		damping: 1
	});

	$: springySalaryCents.set(salaryCents);

	let salaryPercent: number = 0;
	$: salaryPercent = salaryCents / MAX_SALARY;

	const numberFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	});
</script>

<BigText text="Salary" />
<div class="slider-container">
	<input bind:value={salaryCents} type="range" min="1" max={MAX_SALARY} orient="vertical" />
	<h2
		style="bottom: calc({salaryPercent * 100}% - {20 * salaryPercent}px + 10px); 
        font-size: calc(26px + {salaryPercent * 16}px);
        color: rgb(0, {salaryPercent * 255}, 0);"
		class="salary-label"
	>
		{numberFormatter.format($springySalaryCents / 100)}
	</h2>
</div>

<style>
	.slider-container {
		position: relative;
		height: 40%;
		width: min(90%, 400px);
		display: flex;
		align-items: center;
	}

	.salary-label {
		font-family: 'Belgrano';
		position: absolute;
		left: 35px;
		text-align: left;
		line-height: 0px;
		margin: 0;
		text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.7);
	}

	input {
		position: absolute;
		top: 0px;
		height: 100%;
		left: 10px;
		display: inline;
		margin: auto;
		appearance: slider-vertical;
		display: inline;
	}
</style>
