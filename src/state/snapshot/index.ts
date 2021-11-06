import Client from '../../plugins/snapshot-labs/snapshot.js/src/client';
const hubUrl: any = 'https://testnet.snapshot.org';
const snapshot = new Client(hubUrl);
export default snapshot;