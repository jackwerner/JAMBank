// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "../node_modules/@0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "../node_modules/@0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";

//NOTE: MUST APPROVE SELLER CONTRACT TO SELL COINS MINTED HERE VIA IMPORTED APPROVE FXN
//AMOUNT ERRORS ARE LIKELY DUE TO WEI CONVERSION

contract JAMMint is NFTokenMetadata, Ownable {
 
  constructor() {
    nftName = "JAMBankDigitalAsset";
    nftSymbol = "JBDA";
  }
 
  function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner {
    super._mint(_to, _tokenId);
    super._setTokenUri(_tokenId, _uri);
  }
  
}