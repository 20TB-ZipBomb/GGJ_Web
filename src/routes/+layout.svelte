<div>
	<slot />
</div>

<style>
	:global(html) {
		background: #0e1321;
		margin: 0;
		background-image: url('newspaper-ripped.jpg');
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
		/* darken background image */
	}

	:global(body) {
		margin: 0;
	}

	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		gap: 20px;
	}
</style>
