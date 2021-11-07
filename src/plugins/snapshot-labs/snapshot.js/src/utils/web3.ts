import { hexlify } from '@ethersproject/bytes';

export async function signMessage(web3: any, msg: any, address: any) {
  msg = hexlify(new Buffer(msg, 'utf8'));
  return await web3.send('personal_sign', [msg, address]);
}

export async function getBlockNumber(provider: any) {
  try {
    const blockNumber: any = await provider.getBlockNumber();
    return parseInt(blockNumber);
  } catch (e) {
    return Promise.reject();
  }
}
