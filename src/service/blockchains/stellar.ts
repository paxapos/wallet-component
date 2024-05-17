import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarNetwork } from '../../stellar_account';

export async function getSaldo(addr: string): Promise<number> {
	var server = new StellarSdk.Horizon.Server(stellarNetwork);
	var accountId = addr;

	// Create an API call to query payments involving the account.

	const accountResult = await server.accounts().accountId(accountId).call();

	console.log('Balances for account: ' + accountId);
	accountResult.balances.forEach(function (balance) {
		console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
	});

	return parseFloat(accountResult.balances[0].balance);
}
