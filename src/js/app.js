App = {
  web3Provider: null,
  contracts: {},
  
  init: async function() {
    // Load products.
    $.getJSON('../products.json', function(data) {
      var prodRow = $('#prodRow');
      var prodTemplate = $('#prodTemplate');
      for (i = 0; i < data.length; i ++) {
      	if (data[i].forSale == "true"){
			prodTemplate.find('.panel-title').text(data[i].name);
			prodTemplate.find('img').attr('src', data[i].picture);
			prodTemplate.find('.description').text(data[i].description);
			prodTemplate.find('.date').text(data[i].date);
			prodTemplate.find('.price').text(data[i].price);
			prodTemplate.find('button').attr('data-id',data[i].id);
			prodTemplate.find('button').attr('data-price',data[i].price);
			prodTemplate.find('button').attr('data-URI',data[i].URI);
			prodTemplate.find('button').attr('data-contractaddress',data[i].contractaddress);

			prodRow.append(prodTemplate.html());
		}
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Purchasing.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var PurchasingArtifact = data;
      App.contracts.Purchasing = TruffleContract(PurchasingArtifact);
    
      // Set the provider for our contract
      App.contracts.Purchasing.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the owned products
      return App.markOwned();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-purchase', App.handlePurchase);
  },

  markOwned: function() {
    var purchasingInstance;
    
    App.contracts.Purchasing.deployed().then(function(instance) {
      purchasingInstance = instance;
    
      return purchasingInstance.getOwners.call(); //calling contract function to see if owned 
    }).then(function(owners) {
      for (i = 0; i < owners.length; i++) {
        if (owners[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-prod').eq(i).find('button').text('Owned').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  
  handlePurchase: function(event) {
    event.preventDefault();
    console.log($(event.target).data());

    var prodId = parseInt($(event.target).data('id'));
    console.log(prodId);
	var price = $(event.target).data('price');
	var weiprice = web3.toWei(price, 'ether');
	var contractaddress = $(event.target).data('contractaddress'); //must be lowercase
	//console.log(seller);
	var prodURI = $(event.target).data('uri'); //must be lowercase
    var purchasingInstance;
    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var buyer = accounts[0]; //name of buyer, first and only name in array
      App.contracts.Purchasing.deployed().then(function(instance) {
        purchasingInstance = instance;
    	
    	//send money to contract
    	//let send = web3.eth.sendTransaction({from:buyer, to:CONTRACT_ADDRESS, value: weiprice})
    	
        // Execute purchase as a transaction by sending account
        //console.log(seller);
        console.log(weiprice);
        console.log(contractaddress);
        console.log(prodId);
        return purchasingInstance.purchaseToken(prodId, contractaddress, weiprice, {from: buyer, value: weiprice}); //maybe do value: weiprice
      }).then(function(result) {
        var newOwner = result.receipt.from; //BUYER (NEW OWNER) ADDRESS
                    
            App.contracts.Purchasing.deployed().then(function(instance) {
              purchasingInstance = instance;
              //return purchasingInstance.ownerOf(testId); //calling contract function to see if owned 
              alert(newOwner)
              alert(result.receipt.to);
              return purchasingInstance.balanceOf(newOwner);
            }).then(function(ownerToNFTokenCount){
        	  alert(ownerToNFTokenCount);
              //alert(_owner);
            }).catch(function(err) {
              console.log(err.message);
            });
        
        //window.location.href='/confirmation.html';
        return App.markOwned();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
