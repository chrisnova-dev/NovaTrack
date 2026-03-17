export const getTokenLogo = (address) => {

  if (!address) return null

  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

}