<script lang="ts">
	import Wallet from './lib/Wallet.svelte';
	import {
		Alert,
		Card,
		Heading,
		Hr,
		Input,
		Label,
		Span,
	} from 'flowbite-svelte';

	// cargar pubKey de stellar
	let addr: string = '';

	let priv: string = '';
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
		<div >
			<Label>Pub key</Label>
			<Input class="bg-slate-300" bind:value={addr} />

			<Label>Priv key</Label>
			<Input class="bg-slate-300" bind:value={priv} />

			{#if !addr || !priv}
				<Alert color="red">
					Deberá completar su clavr public y privada
				</Alert>
			{/if}
		</div>

		<Card
			padding="xl"
			size="md"
			class="rounded-3xl border-gray-200 items-center  bg-gray-400 m-auto"
		>
			<Wallet address={addr} pasword={priv} />
		</Card>
	</div>
</main>
