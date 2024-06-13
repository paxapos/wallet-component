import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarNetwork } from '../../stellar_account';
import { AssetCodes } from '../../globals';
import { Asset, Networks, Operation } from '@stellar/stellar-sdk';

const server = new StellarSdk.Horizon.Server(stellarNetwork);

/**
 * Network con la que voy a trabajar
 * TESTNET es la red de pruebas de stellar
 * PUBLIC es la red principal de stellar
 *
 */
const network = Networks.TESTNET;
/*
export async function eventSourceListener(
	account: string,
	cb: Function,
	errCb: Function,
) {
	var es = new EventSource(
		`https://horizon-testnet.stellar.org/accounts/${account}/payments`,
	);

	console.info('me levantoi OK el event source', es);
	es.onmessage = function (message) {
		cb(message);
	};

	es.onerror = function (error) {
		errCb(error);
	};
}
*/
export async function getBalance(
	addr: string,
	assetCode: AssetCodes = AssetCodes.XLM,
): Promise<number> {
	const accountId = addr;

	// Create an API call to query payments involving the account.

	const accountResult = await server.accounts().accountId(accountId).call();

	console.log('Balances for account: ' + accountId);
	const balanceNativo = accountResult.balances.filter((balance) => {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);

		return balance.asset_type == 'native';
		//return balance.asset_code === assetCode;
	});
	console.info('los balances son', accountResult.balances);

	console.info('el balance nativo es', balanceNativo);

	return parseFloat(accountResult.balances[0].balance);
}

/**
 *
 * @param monto el monto a pagar
 * @param payer el User es la claeve public y privada del user
 * @param beneficiary el string de la clave public
 * @param assetCode el codigo del activo que se quiere enviar
 */
export async function createPayment(
	monto: number,
	payer: User,
	beneficiary: string,
	assetCode: AssetCodes = AssetCodes.XLM,
) {
	try {
		let sourceKeys = await StellarSdk.Keypair.fromSecret(payer.privKey);
		let sourceAcount = await server.loadAccount(payer.pubKey);

		var transaction = new StellarSdk.TransactionBuilder(sourceAcount, {
			fee: StellarSdk.BASE_FEE,
			networkPassphrase: network,
		});

		const operation1 = transaction.addOperation(
			Operation.payment({
				destination: beneficiary,
				amount: String(monto),
				//en esta linea esta el problema de que monto si o si se tiene que ingresar como un string
				//a su vez monto es la cantidad de dinero que se quiere enviar a una cuenta en una transaccion
				//por lo que tendria que ingresarse como un entero
				asset: new Asset(assetCode, payer.pubKey),
			}),
		);
		let operation2 = operation1.setTimeout(100);

		let pruebaArmada = operation2.build();
		console.log(pruebaArmada);

		pruebaArmada.sign(sourceKeys);
		const pruebaTerminada = await server.submitTransaction(pruebaArmada);
		console.log(pruebaTerminada);
	} catch (err) {
		console.log('No se pudo completar la transacción');
	}
}
