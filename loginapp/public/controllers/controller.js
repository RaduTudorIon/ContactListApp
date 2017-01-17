var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

var refresh=function(){
$http({
      method: 'GET',
      url: '/contactlist'
    })
    .then(function(response) {
    	console.log("I got the data I requested")
      $scope.contactlist =  response.data;
      $scope.contact =null; 
    });
};		

refresh();

    $scope.addContact=function () {
    	console.log($scope.contact);
    	$http.post('/contactlist',$scope.contact).then(function(response){
    		console.log(response);
    		refresh();
    	});
    };

    $scope.remove = function(id){
    	console.log(id);
    	$http.delete('/contactlist/'+id).then(function(response){
    		refresh();
    	});
    };

    $scope.edit=function(id){
    	console.log(id);
    	$http.get('/contactlist/'+id).then(function(response){
    			$scope.contact=response.data;
    			});
    };

    $scope.update=function(){
    	console.log($scope.contact._id);
    	$http.put('/contactlist/'+$scope.contact._id,$scope.contact).then(function(response){
    		
    		refresh();
    	})
    };

    $scope.deselect=function(){
    	$scope.contact="";
    }
   /*  person1= {
        name: 'Tim',
        email: 'tim@gmail.com',
        number:'(571) 426-1433'
    };

    person2 = {
        name:'Liam',
        email:'neason@taken2.com',
        number: '(777) 777-7777'
    };

    person3={
        name: 'Jessie',
        email:'jessie@vma.com',
        number: '(684) 426-1232'
    };

var contactlist = [person1, person2, person3];

$scope.contactlist = contactlist;*/

}]);
