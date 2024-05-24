import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarNetwork } from '../../stellar_account';

import {
	TransactionBuilder,
	Networks,
	Operation,
	Asset,
} from '@stellar/stellar-sdk';
import { AssetCodes } from '../../globals';

const server = new StellarSdk.Horizon.Server(stellarNetwork);

/**
 *
 * @param monto el monto a pagar
 * @param payer el User es la claeve public y privada del user
 * @param beneficiary el string de la clave public
 * @param assetCode el codigo del activo que se quiere enviar
 */
export async function envio(
	monto: number,
	payer: User,
	beneficiary: string,
	assetCode: AssetCodes = AssetCodes.XLM,
) {
	try {
		let sourceKeys = await StellarSdk.Keypair.fromSecret(payer.privKey);
		let sourceAcount = await server.loadAccount(payer.pubKey);

		var transaction = new TransactionBuilder(sourceAcount, {
			fee: StellarSdk.BASE_FEE,
			networkPassphrase: Networks.TESTNET,
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

//Una funcion mas simple para ver el saldo de una cuenta
let tomarSaldo = async (cuenta: User) => {
	try {
		let sourceAcount = await server.loadAccount(cuenta.pubKey);
		console.log(sourceAcount.balances[0].balance);
	} catch (err) {
		console.log('no tomamos el saldo');
	}
};
