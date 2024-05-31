<script lang="ts">
	import { ButtonGroup, Button, Modal, Input } from 'flowbite-svelte';
	import { getSaldo } from '../service/blockchains/stellar';
	import WalletQR from './WalletQR.svelte';

	export let address: string;

	let saldo = 0;

	getSaldo(address).then((res) => {
		saldo = res;
	});

	let saldoFormateado = '';

	console.info('Wallet component loaded address: ', address);

	$: if (saldo > 0) {
		const formateador = new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 2, // Cantidad mínima de decimales
			maximumFractionDigits: 2, // Cantidad máxima de decimales
		});

		saldoFormateado = formateador.format(saldo);
	} else {
		saldoFormateado = 'Sin saldo';
	}

	let openModalQR = false;
	function generarQr() {
		openModalQR = true;
	}

	let openModalPagar = false;
	function pagar() {
		openModalPagar = true;
	}

	import { stellarAccount2, stellarAccount1 } from '../stellar_account';

	/*De esta manera se ejecutaria una transacción en la testnet de stellar*/
	import InputPagar from './InputPagar.svelte';

	let paymentDone: PaymentDone | null = null;

	function manejarPagoRealizado(event: CustomEvent<PaymentDone>) {
		paymentDone = event.detail;
		openModalPagar = false;
	}
</script>

<Modal bind:open={openModalQR} autoclose>
	<div class="m-auto text-center flex justify-center align-middle">
		<WalletQR value={stellarAccount1.pubKey} />
	</div>
</Modal>

<Modal bind:open={openModalPagar} autoclose>
	<div class="m-auto text-center flex justify-center align-middle">
		<InputPagar
			stellarAccount={stellarAccount1}
			on:paymentDone={manejarPagoRealizado}
		/>
	</div>
</Modal>

<div class="flex items-center flex-wrap gap-4">
	{#if paymentDone}
		<div
			class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<strong class="font-bold">Pago realizado!</strong>
			<span class="block sm:inline"
				>Se envió {paymentDone.amount} a {paymentDone.destination}</span
			>
		</div>
	{/if}

	<h1 class="text-gray-800 text-2xl sixa-max">{saldoFormateado}</h1>
	<ButtonGroup>
		<Button outline color="blue" on:click={generarQr}>
			Generar QR
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
			<path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
		  </svg>
		</Button>
		<Button  outline color="blue"  on:click={pagar}>
			Pagar
			<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
			  </svg>
		</Button>
		<Button  outline color="blue"  on:click={pagar}>
		Actividad
		<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
			<path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
		</svg>
		</Button>
	</ButtonGroup>
</div>
