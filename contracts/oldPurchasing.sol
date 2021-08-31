// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;
 
import "../node_modules/@0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "../node_modules/@0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
 
contract oldPurchasing is NFTokenMetadata, Ownable {
 
  constructor(string memory _name,string memory _symbol) payable{
    nftName = _name;
    nftSymbol = _symbol;
  }

  function purchase(address _buyer, address _seller, uint256 weiprice, uint256 id, string calldata _uri) public payable{
      require(msg.value > 0,"No Ether Sent");
      require(msg.value == weiprice, "Insufficient Funds");
      mint(_buyer, id, _uri); //_buyer is owner of the minted token but can't call any functions of this contract
      payable(_seller).transfer(msg.value); // send the ETH to the seller
  }

  /**
   * @dev Mints a new NFT.
   * @param _to The address that will own the minted NFT.
   * @param _tokenId of the NFT to be minted by the msg.sender.
   * @param _uri String representing RFC 3986 URI.
   */
   //OWNER here is jack, owner of the contract
  function mint(address _to,uint256 _tokenId, string calldata _uri) internal{
    super._mint(_to, _tokenId);
    super._setTokenUri(_tokenId, _uri);
  }

  /**
   * @dev Removes a NFT from owner.
   * @param _tokenId Which NFT we want to remove.
   */
    //OWNER here is jack, owner of the contract
  function burn(uint256 _tokenId) external onlyOwner{
    super._burn(_tokenId);
  }
 //ADD DEV FOR ROYALTIES -- 
  

}