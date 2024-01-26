<script lang="ts">
	export let text: String = '';
	export let disabled: boolean = false;
</script>

<button class:disabled {disabled} on:click>{text}</button>

<style>
	/* Remove built in button styling */
	button {
		background: white;
		width: min(400px, 80%);
		border: none;
		padding: 0;
		cursor: pointer;
		font-size: 30px;
		height: 100px;
		font-weight: bold;
		border-radius: 10px;
		box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.8);
		border: 2px solid #eee;
		color: #111;
		transition: transform 0.1s ease-in-out;
	}

	button:hover {
		background: #eee;
	}

	button:not(:disabled):active {
		transform: translate(2px, 4px);
	}

	button:disabled {
		background: #ccc;
		color: #999;
		cursor: not-allowed;
	}
</style>
