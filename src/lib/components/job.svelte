<script>
	export let title = 'Job Title';
	export let isSelected = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<p on:click class:isSelected>{title}</p>

<style>
	p {
		background-color: white;
		text-align: center;
		font-size: 2em;
		margin: 5%;
		text-align: center;
	}

	p.isSelected {
		border: 2px solid #008000;
	}
</style>
