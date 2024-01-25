<script lang="ts">
	export let text: String = '';
</script>

<button on:click>{text}</button>

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
	}
</style>
