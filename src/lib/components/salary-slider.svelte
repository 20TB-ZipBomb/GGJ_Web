<script>
	export let salaryCents = 1;

	const numberFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	});
</script>

<div class="slider-container">
	<div class="input-container">
		<input bind:value={salaryCents} type="range" min="1" max="100000" orient="vertical" />
	</div>
	<h1 class="salary-label">{numberFormatter.format(salaryCents / 100)}</h1>
</div>

<style>
	.slider-container {
		height: 40%;
		width: 80%;
		display: flex;
		align-items: center;
	}

	.salary-label {
		text-align: center;
		font-size: 50pt;
		display: inline;
		margin: auto;
	}

	input {
		height: 100%;
		left: 10px;
		display: inline;
		margin: auto;
		appearance: slider-vertical;
		display: inline;
	}

	.input-container {
		width: 20%;
		height: 100%;
		display: inline;
	}
</style>
