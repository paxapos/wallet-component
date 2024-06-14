<script lang="ts">
	import { onMount } from 'svelte';

	// @ts-expect-error
	import { default as QrCode } from 'qrious';

	const QRcode = new QrCode();

	export let value: string;
	export let errorCorrection = 'L';
	export let background = '#fff';
	export let color = '#000';
	export let size = '200';
	export let padding = 0;
	export let className = 'qrcode';

	let image = '';
	let amount: number;
	let recipient: string; 

	function generateQrCode() {
		QRcode.set({
			background,
			foreground: color,
			level: errorCorrection,
			padding,
			size,
			value,
		});

		image = QRcode.toDataURL('image/jpeg');
	}

	export function getImage() {
		return image;
	}

	$: {
		if (value) {
			generateQrCode();
		}
	}

	onMount(() => {
		generateQrCode();
	});
</script>

<div  class=" fixed inset-0  flex items-center justify-center  "
>
	<div class=" bg-blue-200 p-6 rounded-lg shadow-lg w-200 ">
		<h1 class="text-gray-800 text-3xl sixa-max"> QR</h1>
		<div class="items-center justify-center mb-4">
			<img src={image} alt={value} class={className} />
		</div>
		<div class=" items-center justify-center space-x-4">
			<button
				class="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600"
				on:click={() => {
					amount = 0;
					recipient = '';
				}}>Cancelar</button
			>
		</div>
	</div>
</div>

