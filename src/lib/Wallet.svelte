<script lang="ts">
	import { ButtonGroup, Button } from 'flowbite-svelte';
	import { getSaldo } from '../service/blockchains/stellar';

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
