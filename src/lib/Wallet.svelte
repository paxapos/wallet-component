<script lang="ts">
	import { ButtonGroup, Button, Modal, Input } from 'flowbite-svelte';
	import { getBalance } from '../service/blockchains/stellar';
	import WalletQR from './WalletQR.svelte';

	import {
		Dropdown,
		DropdownItem,
		DropdownHeader,
		Avatar,
	} from 'flowbite-svelte';
	import { BellSolid, EyeSolid } from 'flowbite-svelte-icons';
	import { eventSourceListener } from '../service/blockchains/stellar';
	import {horizonEventSource} from '../service/blockchains/stellar'
	import {paymentsdones} from '../service/blockchains/stellar'
	import {paymentRealized} from '../service/blockchains/stellar'
	import { createEventDispatcher } from 'svelte';
	export let address: string;
	export let pasword: string;

	let saldo = 0;
	let saldoFormateado = '';
	$: if (saldo > 0) {
		const formateador = new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 2, // Cantidad mínima de decimales
			maximumFractionDigits: 2, // Cantidad máxima de decimales
			
		});
	saldoFormateado = formateador.format(saldo);
		
	}
	$: if (saldo==0) {
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
	getBalance(address).then((res) => {
		saldo = res;
	});

	$: if (address.length==56){
		eventSourceListener(
		address,
		async (res: any) => {
			console.info('me llego un mensaje', res);
			saldo = await getBalance(address);
		},
		(msgError: any) => {
			console.error('me paso algo malisimo', msgError);

		},
	);
	}
	$: if (address.length!==56){
            horizonEventSource?.close();
            console.log(saldo)
			saldo=0
}
const dispatcher = createEventDispatcher();
	$: if (paymentRealized) {
		
		dispatcher('paymentDone', paymentDone);
		getBalance(address).then((res) => {
		saldo = res;
	});

	}


	/*De esta manera se ejecutaria una transacción en la testnet de stellar*/
	import InputPagar from './InputPagar.svelte';
	import { get } from 'svelte/store';

	let paymentDone: PaymentDone | null = null;

	function manejarPagoRealizado(event: CustomEvent<PaymentDone>) {
		paymentDone = event.detail;
		openModalPagar = false;
	}
</script>

<Modal bind:open={openModalQR} autoclose>
	<div class="m-auto flex justify-center ">
		<WalletQR value={address} size="500" />
	</div>
</Modal>

<Modal bind:open={openModalPagar} autoclose>
	<div class="text-center justify-center align-middle ">
		<InputPagar 
			stellarAccount={{
				"pubKey": address,
				"privKey": pasword,
			}}
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

	<h1 class="text-gray-800 text-3xl sixa-max">{saldoFormateado}</h1>
	<ButtonGroup >
		<Button class="bg-gray-300" outline color="light" on:click={generarQr}>
			Generar QR
			<svg
				class="w-6 h-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke="currentColor"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"
				/>
				<path
					stroke="currentColor"
					stroke-linejoin="round"
					stroke-width="2"
					d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"
				/>
			</svg>
		</Button>
		<Button   class="bg-gray-300" outline color="light" on:click={pagar}>
			Pagar
			<svg
				class="w-6 h-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
				/>
			</svg>
		</Button>
	</ButtonGroup>
	<div
		id="bell"
		class="inline-flex items-center text-sm font-medium text-center text-black hover:text-gray-500 focus:outline-none dark:hover:text-white dark:text-dark"
	>
		<BellSolid class="w-8 h-8" />
		<div class="flex relative">
			<div
				class="inline-flex relative -top-2 end-4 w-3 h-3 bg-red-700 rounded-full border-2 border-white dark:border-gray-800"
			/>
		</div>
	</div>
		<Dropdown 
			triggeredBy="#bell"
			class="w-full max-w-sm rounded divide-y divide-dark-100 shadow dark:bg-black dark:divide-black">
			<div slot="header" class="bg-gray-400 text-center py-2 font-bold">
				<h1 class="text-dark">Actividad</h1>
			</div>
			<DropdownItem class="flex space-x-4 rtl:space-x-reverse">
				<Avatar
					src="/images/profile-picture-1.webp"
					dot={{ color: 'bg-dark' }}
					rounded
				/>
				<div class="ps-3 w-full">
					<div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
						Nueva trasferencia de <span
							class="font-semibold text-gray-900 dark:text-white"
							>Jese Leos</span
						>
						: Ha trasferido $500
					</div>
					<div class="text-xs text-primary-600 dark:text-primary-500">
						a few moments ago
					</div>
				</div>
			</DropdownItem>
			<DropdownItem class="flex space-x-4 rtl:space-x-reverse">
				<Avatar
					src="/images/profile-picture-1.webp"
					dot={{ color: 'bg-dark' }}
					rounded
				/>
				<div class="ps-3 w-full">
					<div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
						Nueva trasferencia de <span
							class="font-semibold text-gray-900 dark:text-white"
							>Jese Leos</span
						>
						: Ha trasferido $500
					</div>
					<div class="text-xs text-primary-600 dark:text-primary-500">
						a few moments ago
					</div>
				</div>
			</DropdownItem>
			<DropdownItem class="flex space-x-4 rtl:space-x-reverse">
				<Avatar
					src="/images/profile-picture-1.webp"
					dot={{ color: 'bg-dark' }}
					rounded
				/>
				<div class="ps-3 w-full">
					<div class="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
						Nueva trasferencia de <span
							class="font-semibold text-gray-900 dark:text-white"
							>Jese Leos</span
						>
						: Ha trasferido $500
					</div>
					<div class="text-xs text-primary-600 dark:text-primary-500">
						a few moments ago
					</div>
				</div>
			</DropdownItem>
		</Dropdown>	
</div>
