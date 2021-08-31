//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "../node_modules/@0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "../node_modules/@0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";

contract Purchasing is Ownable {

event Sent(address indexed payee, uint256 amount, uint256 balance);
event Received(address indexed payer, uint tokenId, uint256 amount, uint256 balance);

ERC721 public nftAddress;
uint256 public currentPrice;

//seperate mint contract for each token --> seperate contract address and thus price

/**
* @dev Purchase _tokenId
* @param _tokenId uint256 token ID (painting number)
*/
function purchaseToken(uint256 _tokenId, address _nftAddress, uint256 _currentPrice) public payable {
    require(msg.sender != address(0) && msg.sender != address(this));
    require(msg.value >= currentPrice);
	require(_nftAddress != address(0) && _nftAddress != address(this));
    require(_currentPrice > 0);
    nftAddress = ERC721(_nftAddress);
    currentPrice = _currentPrice;
    address tokenSeller = nftAddress.ownerOf(_tokenId);
    nftAddress.safeTransferFrom(tokenSeller, msg.sender, _tokenId);
    emit Received(msg.sender, _tokenId, msg.value, address(this).balance);
}

/**
* @dev send / withdraw _amount to _payee
*/
function sendTo(address payable _payee, uint256 _amount) public onlyOwner {
    require(_payee != address(0) && _payee != address(this));
    require(_amount > 0 && _amount <= address(this).balance);
    _payee.transfer(_amount);
    emit Sent(_payee, _amount, address(this).balance);
}

/**
* @dev Updates _currentPrice
* @dev Throws if _currentPrice is zero
*/
function setCurrentPrice(uint256 _currentPrice) public onlyOwner {
    require(_currentPrice > 0);
    currentPrice = _currentPrice;
}

}