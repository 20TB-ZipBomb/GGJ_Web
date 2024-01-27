<slot />

<style>
	@keyframes scrollBackground {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -856px -1101px;
		}
	}

	:global(html) {
		background: #0e1321;
		margin: 0;
		background-image: url('classifieds-seamless-blur.png');
		background-repeat: repeat;
		background-attachment: fixed;
		/* darken background image */

		animation: scrollBackground 10s linear infinite;
	}

	:global(body) {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		gap: 20px;
	}
</style>
