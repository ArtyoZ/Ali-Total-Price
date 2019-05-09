// ==UserScript==
// @author       AndShy
// @name         Ali Total Price
// @description  Show Total Price on Aliexpress
// @version      1.1
// @namespace    https://github.com/AndShy
// @homepageURL  https://github.com/AndShy/Ali-Total-Price
// @downloadURL  https://github.com/AndShy/Ali-Total-Price/Ali_Total_Price.user.js
// @match        *://*.aliexpress.com/item/*
// @compatible   chrome
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var productShippingPrice, productInfo, topPanel, skuList, quantInp, totPrice;
    var observer = new MutationObserver(changePrice);
    var config1 = { attributes: true, attributeFilter: ['value'], childList: false, subtree: false};
    var config2 = { attributes: true, childList: false, subtree: true, characterData: true};

    document.addEventListener('readystatechange', event => {
		if (event.target.readyState === 'complete') {
    		completeLoading();
  		}
	});

    /*function debugging(state) {
    	//alert('DEBUG ' + state);
    	console.log('debug :' + state);
    	console.log(document.getElementById('top-lighthouse'));
    }*/


    function completeLoading() {
    	skuList = document.querySelector('div.product-sku');
    	topPanel = document.getElementById('top-lighthouse');
    	quantInp = document.querySelector('span.next-input.next-medium.next-input-group-auto-width >:first-child');
    	productInfo = document.querySelector('div.product-info');
    	productShippingPrice = document.querySelector('div.product-shipping');

    	if (productInfo){
    	totPrice = document.createElement('div');
    	totPrice.innerHTML =
    	"<span class='bold' style='font-size:24px'>Total Price : </span>" + "<span class='bold' id='ttlprc' style='font-size:24px; color:red'>---</span>";
    	//parelm = shippingEl.parentNode;
    	//shippingEl.parrentNode.appendChild(totPrice);
    	productInfo.insertBefore(totPrice, productInfo.querySelector('div.product-action'));

    	getPrice();

    	//document.querySelector('span.next-input.next-medium.next-input-group-auto-width >:first-child').addEventListener('input', changePrice, false);
   		//document.querySelector('span.next-input-group').addEventListener('mouseup', changePrice, false);
   		//quantInp.dispatchEvent(new Event('tstev'));
   		//quantInp.addEventListener('tstev', changePrice, false);
    	//console.log(document.querySelector('span.next-input.next-medium.next-input-group-auto-width >:first-child'));
    	//document.querySelector('span.next-input-group').addEventListener('change', changePrice, true);

    	//document.addEventListener('afterscriptexecute', evDebug);
    	//document.documentElement.addEventListener('load', evDebug, true);
    	changePrice();
    	if (quantInp) observer.observe(quantInp, config1);
    	if (skuList) observer.observe(skuList, config2);
    	if (productShippingPrice) observer.observe(productShippingPrice, config2);
    	}
    }



    function getPrice() {
    	    var priceEl = document.querySelector('span.product-price-value');
    	if (priceEl){
    		if (priceEl.textContent.match(/^.*?\d+.?\d{0,5} \- \d+.?\d{0,5}.*?$/m)) {
    			return;
    		}
    		else {
    			return priceEl.textContent.replace(/^.*?(\d+)(\.|,)?(\d{0,5}).*?$/m,'$1.$3');

    		}
    		/*if (priceEl.textContent.match(/^.{1,3} .?\d+(\.|\,)?\d*? \- \d+(\.|\,)?\d*?$/m)) {
    			//console.log(priceEl.textContent.match(/^.{1,3} .?\d+(\.|\,)?\d*? \- \d+(\.|\,)?\d*?$/m));
    			return;
    		}
    		else {
    			if (priceEl.textContent.match(/^.{1,3} .?(\d+\.?\d{0,5})$/m)) {
    				//console.log(priceEl.textContent.match(/^.{1,3} .?(\d+\.?\d{0,5})$/m)[1]);
    			return priceEl.textContent.match(/^.{1,3} .?(\d+\.?\d{0,5})$/m)[1];
    			}
    			else {
    				var tmp = priceEl.textContent.match(/^.{1,3} .?(\d+\,?\d{0,5})$/m)[1];
    				if (tmp.match(/^\d+\,\d{0,5}$/))	{
    						//console.log('----!!!!!----')
    						return tmp.replace(/^(\d+)\,(\d{0,5})$/,'$1.$2');
    					}
    				else {
    						return tmp;
    					}
    			}

    		}*/

    	}
    return;
    }

    function getCurrency() {
    	//console.log(document.querySelector("span.currency"));
      if (document.querySelector("span.currency").textContent) {
        return document.querySelector("span.currency").textContent;
      }
      else {
        return 'USD';
      };
    }

    function getShipping() {
    	var shippingCost = document.querySelector('span.product-shipping-price');
    	if (shippingCost.textContent.match(/^.*?\d+(\.|,)?\d{0,5}.*?$/m)) {
    		//console.log(shippingCost.textContent.replace(/^.*?(\d+)(\.|,)?(\d{0,5}).*?$/m,'$1.$3'));
    		return shippingCost.textContent.replace(/^.*?(\d+)(\.|,)?(\d{0,5}).*?$/m,'$1.$3');
    	}
    	else {
    		return '0';
    	}

    }

    function changePrice() {
  		//document.getElementById('ttlprc').innerText = document.getElementById('ttlprc').innerText + 1;
  		//document.querySelector('span.next-input.next-medium.next-input-group-auto-width')
  		//console.log(event.type, document.querySelector('span.next-input.next-medium.next-input-group-auto-width >:first-child').value);
  		//alert('Horray! Someone wrote "' + this.value + '"!');
  		//debugger;
  		/*for (var mutation of mutationList){
  			console.log(mutation.type, mutation.attributeName, mutation.oldValue, observer);
  		}*/

  		var ttl = document.getElementById('ttlprc');
  		var price = getPrice();
  		if (price) {
  			ttl.textContent = new Intl.NumberFormat('us-US', { style: 'currency', currency: (getCurrency()) }).format(quantInp.value * price + +getShipping());
  			//console.log(ttl.textContent);
  		}
  		else {
  			ttl.textContent = '---';
  		}

   		//console.log(ttl.textContent, ttl.innerHTML);
	}



})();