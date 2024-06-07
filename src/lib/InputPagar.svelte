<script lang="ts">
	import { Input, Select } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { AssetCodes } from '../globals';
	import { createPayment } from '../service/blockchains/stellar';

	export let stellarAccount: User;

	let amount: number;
	let recipient: string;
	let monedaSeleccionada: string;

	let countries = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' },
	];

	let monedasDisponibles = [
		{
			value: AssetCodes.XLM,
			name: 'Stellar Lumens',
		},
		{
			value: AssetCodes.USDC,
			name: 'USD Coin',
		},
	];

	const dispatcher = createEventDispatcher();

	async function submitForm() {
		// Aquí puedes agregar la lógica para manejar el envío del formulario
		console.log(`Amount: ${amount}, Recipient: ${recipient}`);

		const seEnvio = await createPayment(amount, stellarAccount, recipient);

		const paymentDone: PaymentDone = {
			amount,
			destination: recipient,
		};
		dispatcher('paymentDone', paymentDone);
	}
</script>

<div
	class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
	<div class="bg-blue-200 p-6 rounded-lg shadow-lg w-80">
		<h2 class="text-black text-2xl font-bold mb-4">Enviar Transacción Stellar</h2>
		<div class="mb-4">
			<label for="amount" class="block text-gray-700 mb-2">Monto</label>
			<Input
				type="number"
				bind:value={amount}
				placeholder="Ingrese el monto a pagar"
				class="border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
			/>
		</div>

		<div class="mb-4">
			<label for="amount" class="block text-gray-700 mb-2">Activo</label>
			<Select 
				placeholder="Opciones"
				class="mt-2"
				items={monedasDisponibles}
				bind:value={monedaSeleccionada}
			/>
		</div>

		<div class="mb-4">
			<label for="recipient" class="block text-gray-700 mb-2"
				>Destinatario</label
			>
			<input
				type="text"
				id="recipient"
				bind:value={recipient}
				class="w-full px-3 py-2 border"
			/>
		</div>
		<div class=" items-center justify-center space-x-4">
			<button
				class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-600"
				on:click={() => {
					amount = 0;
					recipient = '';
				}}>Cancelar</button
			>
			<button
				class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-600"
				on:click={submitForm}>Enviar</button
			>
		</div>
	</div>
</div>

