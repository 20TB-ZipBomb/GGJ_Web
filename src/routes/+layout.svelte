<slot />

<!-- he gets it -->
<style>
	@font-face {
		font-family: 'Chomsky';
		src: url('/chomsky.regular.otf') format('opentype');
	}

	@font-face {
		font-family: 'Belgrano';
		src: url('/Belgrano-Regular.ttf') format('truetype');
	}

	@keyframes scrollBackground {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -856px -1101px;
		}
	}

	:global(html) {
		background: white;
		margin: 0;
		background-image: url('/classifieds-seamless-blur.png');
		background-repeat: repeat;
		background-attachment: fixed;
		animation: scrollBackground 20s linear infinite;
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
