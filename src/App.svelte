<script lang="ts">
	import svelteLogo from './assets/svelte.svg';
	import viteLogo from '/vite.svg';
	import Wallet from './lib/Wallet.svelte';
	import { Card, Heading, Hr, Span } from 'flowbite-svelte';
	import WalletQr from './lib/WalletQR.svelte';
	import { stellarAccount1 } from './stellar_account';
	import WalletSaldoHistory from './lib/WalletSaldoHistory.svelte';
	import InputPagar from './lib/InputPagar.svelte';

	// cargar pubKey de stellar
	const addr = stellarAccount1.pubKey;
</script>

<main class="flex flex-col max-w-max m-auto p-10">
	<Heading
		tag="h1"
		class="mb-4 text-center"
		customSize="text-3xl font-extrabold  md:text-5xl lg:text-6xl"
	>
		<h1><Span gradient>Proyecto Wallet</Span></h1>
	</Heading>

	<Heading
		tag="h2"
		class="mb-4  text-orange-300 text-center"
		customSize="text-lg font-extrabold  md:text-5xl lg:text-6xl"
		>web-component</Heading
	>

	<p class="text-lg">
		Usaremos <code>Svelte, flownbite-svelte y tailwind</code> para armar nuestros
		componentes
	</p>

	<div class="flex flex-col gap-8 my-10">
		<Card
			padding="xl"
			size="md"
			class="border-blue-900  items-center  bg-blue-400 m-auto"
		>
			<Wallet address={addr} />
		</Card>

		
	</div>
</main>
