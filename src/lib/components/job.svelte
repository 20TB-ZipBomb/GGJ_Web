<script>
	export let title = 'Job Title';
	export let isSelected = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click class:isSelected>
	<p>{title}</p>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: white;
		width: 90%;
		box-shadow:
			4px 4px 4px rgba(0, 0, 0, 0.5),
			0px 0px 4px rgba(0, 0, 0, 0.5);
		border-radius: 10px;
		transition: background-color 0.2s ease-in-out;
	}

	div:hover {
		cursor: pointer;
	}

	div.isSelected {
		background-color: #ffd700;
	}

	p {
		color: black;
		font-family: 'Belgrano';
		width: 90%;
		text-align: center;
		font-size: 20px;
		text-align: center;
		user-select: none;
	}
</style>
