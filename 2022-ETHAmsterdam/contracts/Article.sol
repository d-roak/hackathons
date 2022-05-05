// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Article is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;
	mapping (address => bool) public allowedAddrs;

	constructor() ERC721("Article", "ART") public { }

	function addToAllowed(address _allowed) public onlyOwner {
		require(_allowed != address(0));
		allowedAddrs[_allowed] = true;
	}

	function removeFromAllowed(address _allowed) public onlyOwner {
		require(_allowed != address(0));
		allowedAddrs[_allowed] = false;
	}

	function isAllowed(address _owner) public view returns (bool) {
		return allowedAddrs[_owner];
	}

	function mintArticle(string memory uri) public {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(msg.sender, tokenId);
		_setTokenURI(tokenId, uri);
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId)
		internal
		override(ERC721, ERC721Enumerable) {
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
		super._burn(tokenId);
	}

	function tokenURI(uint256 tokenId)
		public
		view
		override(ERC721, ERC721URIStorage)
		returns (string memory) {
		return super.tokenURI(tokenId);
	}

	function supportsInterface(bytes4 interfaceId)
		public
		view
		override(ERC721, ERC721Enumerable)
		returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}