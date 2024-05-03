<script lang="ts">

    let saldo = 1000000
    let saldoFormateado = '';

    $: if ( saldo > 0 ) {

        const formateador = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2, // Cantidad mínima de decimales
            maximumFractionDigits: 2, // Cantidad máxima de decimales
        });

        saldoFormateado = formateador.format(saldo)
    } else {
        saldoFormateado = 'Sin saldo'
    }

    function generarQr(){
        alert('Generando QR');
    }

    const pagar = () => {
        alert('Pagando');
    }

</script>

<main>
  <h1>{saldoFormateado}</h1>
  <div class="card">
    <button on:click={generarQr}>Generar QR</button>
    <button on:click={pagar}>Pagar</button>
  </div>
</main>


<style>
    main{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;

    }
</style>