<script lang="ts">
	export let name: String = '';
</script>

<div>
	<p class="hello">HELLO</p>
	<p class="my-name-is">my name is</p>
	<input type="text" placeholder="Your name here" bind:value={name} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: red;
		border-radius: 10px;
		max-width: min(400px, 80%);
		box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.8);
	}

	.hello {
		font-family: 'Belgrano';
		color: white;
		width: 100%;
		text-align: center;
		font-size: 4em;
		margin: 0;
	}

	.my-name-is {
		font-family: 'Belgrano';
		color: white;
		width: 100%;
		text-align: center;
		font-size: 2em;
		margin: 0;
	}

	input {
		width: calc(100% - 20px);
		font-size: 2em;
		border: none;
		text-align: center;
		margin-bottom: 10px;
		margin-top: 10px;
		height: 100px;
		font-weight: bold;
		border-radius: 4px;
	}
</style>
