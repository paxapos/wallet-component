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

	<h1>{saldoFormateado}</h1>
	<ButtonGroup>
		<Button on:click={generarQr}>Generar QR</Button>
		<Button on:click={pagar}>Pagar</Button>
	</ButtonGroup>
</div>
