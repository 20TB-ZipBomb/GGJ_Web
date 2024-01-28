<script lang="ts">
	export let text: String = '';
	export let fontSize: String = '5em';
</script>

<h1 style="font-size: {fontSize}">{text}</h1>

<style>
	h1 {
		font-family: 'Chomsky';
		width: calc(100% - 40px);
		text-align: center;
		color: white;
		text-shadow:
			2px 2px 10px rgba(0, 0, 0, 1),
			4px 4px 0px rgba(0, 0, 0, 0.8);
		margin: 0;
		user-select: none;
	}
</style>
