<script lang="ts">
	import { getWalletAddress } from '../service/blockchain';
	import { ButtonGroup, Button } from 'flowbite-svelte';

	//npm i @stellar/stellar-sdk
	//descargamos las dependencias y las importamos al proyecto
	import * as StellarSdk from '@stellar/stellar-sdk';

	//creamos dos cuentas con su par de claves
	let cuenta1 = StellarSdk.Keypair.random();
	console.log(cuenta1);
	let cuenta2 = StellarSdk.Keypair.random();
	console.log(cuenta2);

	//conectamos con la testnet de stellar
	let server = new StellarSdk.Horizon.Server(
		'https://horizon-testnet.stellar.org',
	);
	console.log(server);

	let saldo = 1000000;
	let saldoFormateado = '';

	let miWallet = getWalletAddress();
	console.info('mi wallet es: ', miWallet);

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

	function generarQr() {
		alert('Generando QR');
	}

	const pagar = () => {
		alert('Pagando');
	};
</script>

<div class="flex items-center flex-wrap gap-4">
	<h1>{saldoFormateado}</h1>
	<ButtonGroup>
		<Button on:click={generarQr}>Generar QR</Button>
		<Button on:click={pagar}>Pagar</Button>
	</ButtonGroup>
</div>
