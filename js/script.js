var app = angular.module('app', ['infinite-scroll']);

app.factory('$getProductsService', ['$http', '$log', function($http, $log) {

    var getPromise = function() {
   
        var promise = $http({method: 'GET', url: 'https://test-prod-api.herokuapp.com/products'});

        promise.error(function(data, status, headers, config) {
            $log.warn(data, status, headers, config);
        });

        return promise;
    };  

    return {
        getPromise: getPromise
    }

}]);
app.controller('ProductData', ['$scope','$getProductsService','filterFilter','$filter', function ($scope,$getProductsService,filterFilter,$filter) {

	$scope.products = [];

	$scope.names = ["All","jeans", "sarees", "tops","pants","tshirts"];

	$scope.madstreet = {
		'items':[],
	    'busy':true
	}
	$scope.low = 'none';
	$scope.high = 'none';
	$scope.highLow = 'none';
	$scope.lowHigh = 'none';

	$getProductsService.getPromise().then(function(response) {
		$scope.products = response.data.products;
		for(var i = 0; i < 9; i++){
			$scope.madstreet.items.push($scope.products[i]);
		}
		$scope.madstreet.busy = false;
    });
    $scope.$watch('selectedName', function(newValue,oldValue) { 
    	$scope.madstreet.items = [];
    	if(newValue!=='All'){
    		$scope.productFilterBasedOnCategory(newValue)
    		$scope.All = false;
    	}else{
    		$scope.All = true;
    		for(var i = 0; i < 9; i++){
    			if($scope.products.length!==0){
    				if($scope.sort){
						if($scope.low==='selected'){
							$scope.orderData =  $filter('orderBy')($scope.products,'score');
						}else if($scope.high==='selected'){
							$scope.orderData = $filter('orderBy')($scope.products,'-score');
						}else if($scope.lowHigh==='selected'){
							$scope.orderData = $filter('orderBy')($scope.products,'price');
						}else if($scope.highLow==='selected'){
							$scope.orderData = $filter('orderBy')($scope.products,'-price');
						}
						for(var i = 0; i < 9; i++){
							$scope.madstreet.items.push($scope.orderData[i]);
						}
					}else{
						for(var i = 0; i < 9; i++){
							$scope.madstreet.items.push($scope.products[i]);
						}
					}
    			}
			}
    	}
    }, true);
	$scope.productFilterBasedOnCategory = function(value){
		$scope.categoryData = filterFilter($scope.products, {cat:value});
		if($scope.sort){
			if($scope.low==='selected'){
				$scope.orderData =  $filter('orderBy')($scope.categoryData,'score');
			}else if($scope.high==='selected'){
				$scope.orderData = $filter('orderBy')($scope.categoryData,'-score');
			}else if($scope.lowHigh==='selected'){
				$scope.orderData = $filter('orderBy')($scope.categoryData,'price');
			}else if($scope.highLow==='selected'){
				$scope.orderData = $filter('orderBy')($scope.categoryData,'-price');
			}
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.orderData[i]);
			}
		}else{
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.categoryData[i]);
			}
		}
		
	}
	$scope.orderByScore = function(value){
		$scope.highLow = 'none';
		$scope.lowHigh = 'none';
		$scope.madstreet.items = [];
		if($scope.high==='none' && value===1){
			$scope.high = 'selected';
		}else{
			$scope.high = 'none';
		}
		if($scope.low==='none' && value===0){
			$scope.low = 'selected';
		}else{
			$scope.low = 'none';
		}
		if(value===0 && $scope.low === 'selected'){
			$scope.sort = true;
			if($scope.All){
				$scope.orderData  = $filter('orderBy')($scope.products,'score');
			}else{
				$scope.orderData  = $filter('orderBy')($scope.categoryData,'score');
			}
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.orderData[i]);
			}
		}else if(value === 1 && $scope.high === 'selected'){
			$scope.sort = true;
			if($scope.All){
				$scope.orderData  = $filter('orderBy')($scope.products,'-score');
			}else{
				$scope.orderData  = $filter('orderBy')($scope.categoryData,'-score');
			}
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.orderData[i]);
			}
		}else{
			$scope.sort = false;
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.products[i]);
			}
		}
	}
	$scope.orderByPrice = function(value){
		$scope.low = 'none';
		$scope.high = 'none';
		$scope.madstreet.items = [];
		if($scope.highLow==='none' && value===1){
			$scope.highLow = 'selected';
		}else{
			$scope.highLow = 'none';
		}
		if($scope.lowHigh==='none' && value===0){
			$scope.lowHigh = 'selected';
		}else{
			$scope.lowHigh = 'none';
		}
		if(value===0 && $scope.lowHigh === 'selected'){
			$scope.sort = true;
			if($scope.All){
				$scope.orderData  = $filter('orderBy')($scope.products,'price');
			}else{
				$scope.orderData  = $filter('orderBy')($scope.categoryData,'price');
			}
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.orderData[i]);
			}
		}else if(value === 1 && $scope.highLow === 'selected'){
			$scope.sort = true;
			if($scope.All){
				$scope.orderData  = $filter('orderBy')($scope.products,'-price');
			}else{
				$scope.orderData  = $filter('orderBy')($scope.categoryData,'-price');
			}
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.orderData[i]);
			}
		}else{
			$scope.sort = false;
			for(var i = 0; i < 9; i++){
				$scope.madstreet.items.push($scope.products[i]);
			}
		}
	}
	$scope.loadMore = function(){
		if($scope.products.length!==0){
			var last = $scope.madstreet.items.length - 1;
			for(var i = 0; i < 9; i++){
				if($scope.sort){
					$scope.madstreet.items.push($scope.orderData[last+i]);
				}else if(!$scope.All){
					$scope.madstreet.items.push($scope.categoryData[last+i]);
				}else{
					$scope.madstreet.items.push($scope.products[last+i]);
				}
				
			}
		}
	}

}]);